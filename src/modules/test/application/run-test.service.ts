import { Injectable } from '@nestjs/common';
import { TestAttemptEntity } from '@modules/performance/domain/attempt.entity';
import { filter, omit, orderBy } from 'lodash';
import { PerformanceStatusEnum, TestPerformanceEntity } from '@modules/performance/domain/performance.entity';
import { EventActionEnum } from '@modules/event/application/create-event.service';
import { StartTrainingEvent } from '@modules/event/infrastructure/events/start-training.event';
import { InjectRepository } from '@nestjs/typeorm';
import {
  EducationProgramPerformanceRepository,
  TestPerformanceRepository
} from '@modules/performance/infrastructure/database/performance.repository';
import { TestAttemptRepository } from '@modules/performance/infrastructure/database/attempt.repository';
import { TestRepository } from '@modules/test/infrastructure/database/test.repository';
import {
  SavedQuestionsOrderRepository
} from '@modules/performance/infrastructure/database/saved-questions-order.repository';
import { CreateSavedQuestionsOrderService } from '@modules/test/application/create-saved-questions-order.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SubmitTestService } from '@modules/test/application/submit-test.service';
import { TestSettingsEntity, } from '@modules/education-program/domain/test-settings.entity';
import { TestEntity } from '@modules/test/domain/test.entity';
import { plainToInstance } from 'class-transformer';
import { RunTestAttemptDto } from '@modules/test/controllers/dtos/run-test-attempt.dto';
import {
  ProgramElementRepository
} from '@modules/education-program/infrastructure/database/program-element.repository';
import {
  EducationProgramRepository
} from '@modules/education-program/infrastructure/database/education-program.repository';
import { TestProgramElementEntity } from '@modules/education-program/domain/program-element.entity';
import { PerformanceException } from '@modules/performance/infrastructure/exceptions/performance.exception';
import { UserException } from '@modules/user/infrastructure/exceptions/user.exception';
import { TestException } from '@modules/test/infrastructure/exceptions/test.exception';

@Injectable()
export class RunTestService {
  constructor(
    @InjectRepository(TestPerformanceRepository)
    private testPerformanceRepository: TestPerformanceRepository,
    @InjectRepository(TestAttemptRepository)
    private testAttemptRepository: TestAttemptRepository,
    @InjectRepository(TestRepository)
    private testRepository: TestRepository,
    @InjectRepository(SavedQuestionsOrderRepository)
    private savedQuestionsOrderRepository: SavedQuestionsOrderRepository,
    @InjectRepository(ProgramElementRepository)
    private programElementRepository: ProgramElementRepository,
    @InjectRepository(EducationProgramRepository)
    private educationProgramRepository: EducationProgramRepository,
    @InjectRepository(EducationProgramPerformanceRepository)
    private educationProgramPerformanceRepository: EducationProgramPerformanceRepository,
    private createSavedQuestionsOrderService: CreateSavedQuestionsOrderService,
    private eventEmitter: EventEmitter2,
    private submitTestService: SubmitTestService,
  ) {}

  async runTest(id: string, userId: string) {
    const performance = await this.testPerformanceRepository.findByIdWithAllRelations(id);
    const test = await this.testRepository.findByIdWithRelationsForRun(performance.test.id);

    if (userId !== performance.user.id) UserException.Forbidden(`Пользователь ${userId}. Недостаточно прав`);
    if (!performance.canRun) {
      PerformanceException.NotEnoughAttempts(
        'Мое расписание',
        `Пользователь id=${userId}. Попытка запустить тест с закончившимися попытками`,
      );
    }
    if (!test.hasQuestions()) TestException.NoQuestions()

    if (!performance?.startDate) performance.startDate = new Date();
    if (performance.performance) {
      if (!performance.performance.startDate) performance.performance.startDate = new Date()
      if (performance.performance.status === PerformanceStatusEnum.DID_NOT_OPEN) performance.performance.status = PerformanceStatusEnum.IN_PROGRESS
      performance.performance.lastOpened = new Date();
      await this.educationProgramPerformanceRepository.save(performance.performance)
    }
    test.themes = filter(orderBy(test.themes, 'order', 'asc'), theme => !theme.theme.isArchived);
    const settings = performance.testSettings;
    const savedQuestionsOrder = await this.savedQuestionsOrderRepository.findByTestAttemptId(
      performance?.lastAttempt?.id,
    );
    settings.shuffleAnswers(test.themes);
    if (!performance?.lastAttempt || performance?.lastAttempt.isClosed) {
      await this.createAttempt(performance, settings, test);
    } else {
      settings.shuffleQuestionsBySavedOrder(test.themes, savedQuestionsOrder);
      if (settings.isTimeIsOver(performance.lastAttempt.createdAt)) {
        await this.submitTestService.submit(performance.id, userId);
        await this.createAttempt(performance, settings, test);
      }
    }

    if (!test.hasQuestions()) TestException.NoQuestions()

    this.eventEmitter.emit(EventActionEnum.START_TRAINING, new StartTrainingEvent(userId, performance.lastAttempt.id));
    return {
      ...performance,
      test,
    };
  }

  private async createAttempt(
    performance: TestPerformanceEntity,
    settings: TestSettingsEntity,
    test: TestEntity,
  ) {
    const testAttempt = new TestAttemptEntity(
      performance.user,
      performance.test,
      performance.testSettings.passingScore,
      performance,
    );
    await this.testAttemptRepository.save(testAttempt);
    performance.lastAttempt = omit(testAttempt, 'performance');
    performance.runTest();
    await this.testPerformanceRepository.save(performance);
    const savedQuestionsInThemeOrder = settings.prepareQuestions(test.themes);
    await Promise.all(
      savedQuestionsInThemeOrder.map(savedOrder =>
        this.createSavedQuestionsOrderService.create(testAttempt, savedOrder.themeId, savedOrder.questionsOrder),
      ),
    );
  }

  // Запуск тестовой попытки
  async runTestAttempt(id: string, testAttemptSettings: RunTestAttemptDto) {
    const fakeSettings = plainToInstance(TestSettingsEntity, testAttemptSettings);
    const test = await this.testRepository.findByIdWithRelationsForRun(id);
    test.themes = filter(orderBy(test.themes, 'order', 'asc'), theme => !theme.theme.isArchived);
    fakeSettings.shuffleAnswers(test.themes);
    fakeSettings.prepareQuestions(test.themes);
    return test;
  }

  // Запуск тестовой попытки внутри программы обучения
  async runTestAttemptInProgram(testElementId: string) {
    const { test, testSettings, educationProgram } =
      (await this.programElementRepository.findTestElementByIdForTestAttempt(
        testElementId,
      )) as TestProgramElementEntity;
    test.themes = filter(orderBy(test.themes, 'order', 'asc'), theme => !theme.theme.isArchived);
    testSettings.shuffleAnswers(test.themes);
    testSettings.prepareQuestions(test.themes);
    return { ...test, educationProgram };
  }
}

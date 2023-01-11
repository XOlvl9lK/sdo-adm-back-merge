import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  EducationProgramPerformanceRepository,
  PerformanceRepository,
  TestPerformanceRepository,
} from '@modules/performance/infrastructure/database/performance.repository';
import {
  AnswerAttemptRepository,
  AttemptRepository,
  TestAttemptRepository,
  TestQuestionAttemptRepository,
} from '@modules/performance/infrastructure/database/attempt.repository';
import { PerformanceException } from '@modules/performance/infrastructure/exceptions/performance.exception';
import { AttemptException } from '@modules/performance/infrastructure/exceptions/attempt.exception';
import { CheckTestHelper } from '@modules/test/domain/check-test.helper';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventActionEnum } from '@modules/event/application/create-event.service';
import { StartTrainingEvent } from '@modules/event/infrastructure/events/start-training.event';
import { QuestionSelectionTypeEnum, TestSettingsEntity } from '@modules/education-program/domain/test-settings.entity';
import { SavedQuestionsOrderRepository } from '@modules/performance/infrastructure/database/saved-questions-order.repository';
import { TestRepository } from '@modules/test/infrastructure/database/test.repository';
import { flatten } from 'lodash';
import { TestPerformanceEntity } from '@modules/performance/domain/performance.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TestAttemptEntity } from '@modules/performance/domain/attempt.entity';
import { LoggerService } from '@core/logger/logger.service';
import { UpdateProgramPerformanceService } from '@modules/performance/application/update-program-performance.service';

@Injectable()
export class SubmitTestService {
  constructor(
    @InjectRepository(TestPerformanceRepository)
    private testPerformanceRepository: TestPerformanceRepository,
    @InjectRepository(TestAttemptRepository)
    private testAttemptRepository: TestAttemptRepository,
    @InjectRepository(TestQuestionAttemptRepository)
    private testQuestionAttemptRepository: TestQuestionAttemptRepository,
    @InjectRepository(AnswerAttemptRepository)
    private answerAttemptRepository: AnswerAttemptRepository,
    @InjectRepository(SavedQuestionsOrderRepository)
    private savedQuestionOrderRepository: SavedQuestionsOrderRepository,
    @InjectRepository(TestRepository)
    private testRepository: TestRepository,
    @InjectRepository(EducationProgramPerformanceRepository)
    private educationProgramPerformanceRepository: EducationProgramPerformanceRepository,
    @InjectRepository(PerformanceRepository)
    private performanceRepository: PerformanceRepository,
    @InjectRepository(AttemptRepository)
    private attemptRepository: AttemptRepository,
    private eventEmitter: EventEmitter2,
    private updateProgramPerformanceService: UpdateProgramPerformanceService
  ) {}

  async submit(performanceId: string, userId: string, scheduler?: boolean, attemptId?: string) {
    const testPerformance = await this.testPerformanceRepository.findByIdWithLastAttempt(performanceId);
    const test = await this.testRepository.findByIdWithRelationsForRun(testPerformance.test.id);
    if (!testPerformance) PerformanceException.NotFound();
    let testAttempt = testPerformance.lastAttempt;
    if (!testAttempt && attemptId) {
      testAttempt = await this.testAttemptRepository.findForViewAnswers(attemptId);
      if (!testAttempt) AttemptException.NotFound();
    }
    const questionAttempts = testAttempt?.questionAttempts;
    const settings = testPerformance.testSettings;
    settings.limitQuestions(test.themes);

    const testResult = CheckTestHelper.calculateTestResult(
      questionAttempts || [],
      settings,
      flatten(test.themes.map(theme => theme.theme.questions)).length,
    );

    let timeSpent: number | undefined;
    if (settings.isTimeIsOver(testAttempt.createdAt)) {
      timeSpent = settings.timeLimit;
    }

    testAttempt.makeAttempt(isNaN(testResult) ? 0 : testResult, timeSpent);
    await this.testAttemptRepository.save(testAttempt);

    testPerformance.makeAttempt(testResult);
    await this.testPerformanceRepository.save(testPerformance);
    if (testPerformance.performance_id) await this.updateProgramPerformanceService.update(testPerformance.performance_id);
    !scheduler && this.eventEmitter.emit(EventActionEnum.END_TRAINING, new StartTrainingEvent(userId, testAttempt.id));
    return testAttempt;
  }

  private async clearQuestionAttempts(testPerformance: TestPerformanceEntity) {
    const questionAttempts = testPerformance.lastAttempt?.questionAttempts;
    if (questionAttempts?.length) {
      const answerAttempts = CheckTestHelper.getAllAnswerAttempts(questionAttempts);
      await Promise.all(answerAttempts.map(attempt => this.answerAttemptRepository.remove(attempt)));
      await Promise.all(questionAttempts.map(attempt => this.testQuestionAttemptRepository.remove(attempt)));
    }
  }

  private async clearSavedQuestionsOrder(settings: TestSettingsEntity, testAttemptId: string) {
    if (settings.questionSelectionType === QuestionSelectionTypeEnum.NEW) {
      const savedQuestionsOrder = await this.savedQuestionOrderRepository.findByTestAttemptId(testAttemptId);
      await Promise.all(savedQuestionsOrder.map(saved => this.savedQuestionOrderRepository.remove(saved)));
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async clearUnusedAttempts() {
    try {
      const unusedAttempts = (await this.attemptRepository.findUnusedAttempts()) as TestAttemptEntity[];
      if (unusedAttempts.length) {
        LoggerService.log('Found unused attempts. Start clearUnusedAttempts', 'SCHEDULER');
        await Promise.all(
          unusedAttempts.map(attempt =>
            this.clearQuestionAttempts(attempt.performance as TestPerformanceEntity)
              .then(() => this.clearSavedQuestionsOrder(attempt.performance.testSettings, attempt.id))
          ),
        );
      }
    } catch (e: any) {
      LoggerService.error(e?.message, e?.stack, 'SCHEDULER');
    }
  }
}

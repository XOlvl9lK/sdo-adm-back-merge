import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CoursePerformanceRepository,
  EducationProgramPerformanceRepository,
  PerformanceRepository,
  TestPerformanceRepository,
} from '@modules/performance/infrastructure/database/performance.repository';
import {
  CourseAttemptRepository,
  TestAttemptRepository,
} from '@modules/performance/infrastructure/database/attempt.repository';
import { RequestQuery } from '@core/libs/types';
import { TestRepository } from '@modules/test/infrastructure/database/test.repository';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventActionEnum } from '@modules/event/application/create-event.service';
import { StartTrainingEvent } from '@modules/event/infrastructure/events/start-training.event';
import { SavedQuestionsOrderRepository } from '@modules/performance/infrastructure/database/saved-questions-order.repository';
import { orderBy } from 'lodash';
import { PerformanceException } from '@modules/performance/infrastructure/exceptions/performance.exception';
import { UserException } from '@modules/user/infrastructure/exceptions/user.exception';

@Injectable()
export class FindPerformanceService {
  constructor(
    @InjectRepository(PerformanceRepository)
    private performanceRepository: PerformanceRepository,
    @InjectRepository(TestPerformanceRepository)
    private testPerformanceRepository: TestPerformanceRepository,
    @InjectRepository(CoursePerformanceRepository)
    private coursePerformanceRepository: CoursePerformanceRepository,
    @InjectRepository(TestAttemptRepository)
    private testAttemptRepository: TestAttemptRepository,
    @InjectRepository(TestRepository)
    private testRepository: TestRepository,
    @InjectRepository(CourseAttemptRepository)
    private courseAttemptRepository: CourseAttemptRepository,
    @InjectRepository(EducationProgramPerformanceRepository)
    private educationProgramPerformanceRepository: EducationProgramPerformanceRepository,
    @InjectRepository(SavedQuestionsOrderRepository)
    private savedQuestionsOrderRepository: SavedQuestionsOrderRepository,
  ) {}

  async findByUser(userId: string, requestQuery: RequestQuery) {
    return await this.performanceRepository.findByUserId(userId, requestQuery);
  }

  async findUserTimeTable(userId: string, requestQuery: RequestQuery) {
    return await this.performanceRepository.findUserTimeTable(userId, requestQuery);
  }

  async findUserTestPerformanceById(id: string, requestQuery: RequestQuery, userId: string) {
    const [testPerformance, [testAttempts, total]] = await Promise.all([
      this.testPerformanceRepository.findByIdWithSettings(id),
      this.testAttemptRepository.findByPerformanceId(id, requestQuery),
    ]);
    if (userId !== testPerformance.userId) UserException.Forbidden(`Пользователь ${userId}. Недостаточно прав`);
    return {
      data: {
        ...testPerformance,
        attempts: testAttempts,
      },
      total,
    };
  }

  async findTestAttemptById(id: string) {
    return this.testAttemptRepository.findById(id);
  }

  async runCourse(id: string, userId: string) {
    const coursePerformance = await this.coursePerformanceRepository.findByIdWithAttempt(id);
    if (userId !== coursePerformance.userId) UserException.Forbidden(`Пользователь ${userId}. Недостаточно прав`);
    if (!coursePerformance.canRun)
      PerformanceException.NotEnoughAttempts(
        'Мое расписание',
        `Пользователь id=${userId}. Попытка запустить курс с закончившимися попытками`,
      );
    if (!coursePerformance?.lastAttempt?.id) {
      coursePerformance.lastAttempt = await this.courseAttemptRepository.findLastByPerformanceId(coursePerformance.id);
    }
    return coursePerformance;
  }

  async findCoursePerformanceById(id: string, requestQuery: RequestQuery, userId?: string) {
    const [coursePerformance, [courseAttempts, total]] = await Promise.all([
      this.coursePerformanceRepository.findByIdWithAttempt(id),
      this.courseAttemptRepository.findByPerformanceId(id, requestQuery),
    ]);
    if (userId && userId !== coursePerformance.userId)
      UserException.Forbidden(`Пользователь ${userId}. Недостаточно прав`);
    return {
      data: {
        ...coursePerformance,
        attempts: courseAttempts,
      },
      total,
    };
  }

  async findProgramPerformanceById(id: string, requestQuery: RequestQuery, userId: string) {
    const [educationProgramPerformance, [programElementPerformances, total]] = await Promise.all([
      this.educationProgramPerformanceRepository.findById(id),
      this.performanceRepository.findByPerformanceId(id, requestQuery),
    ]);
    if (userId !== educationProgramPerformance.userId)
      UserException.Forbidden(`Пользователь ${userId}. Недостаточно прав`);
    return {
      data: {
        educationProgramPerformance,
        programElementPerformances,
      },
      total,
    };
  }

  async runEducationProgram(id: string, requestQuery: RequestQuery, userId: string) {
    const [educationProgramPerformance, [programElementPerformances, total]] = await Promise.all([
      this.educationProgramPerformanceRepository.findById(id),
      this.performanceRepository.findByPerformanceId(id, requestQuery),
    ]);
    if (userId !== educationProgramPerformance.userId)
      UserException.Forbidden(`Пользователь ${userId}. Недостаточно прав`);
    return {
      data: {
        educationProgramPerformance,
        programElementPerformances,
      },
      total,
    };
  }

  async findTestAttemptForViewAnswers(id: string) {
    const testAttempt = await this.testAttemptRepository.findForViewAnswers(id);
    const test = await this.testRepository.findByIdWithRelationsForRun(testAttempt.test.id);
    test.themes = orderBy(test.themes, 'order', 'asc');
    const savedQuestionsOrder = await this.savedQuestionsOrderRepository.findByTestAttemptId(testAttempt.id);
    const settings = testAttempt.performance.testSettings;
    console.log('findTestAttemptForViewAnswers', savedQuestionsOrder)
    settings.shuffleQuestionsBySavedOrder(test.themes, savedQuestionsOrder);
    return {
      testAttempt,
      test,
    };
  }
}

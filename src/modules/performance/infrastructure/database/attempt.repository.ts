import { BaseRepository } from '@core/database/base.repository';
import {
  AnswerAttemptEntity,
  AttemptEntity,
  CourseAttemptEntity,
  TestAttemptEntity,
  TestQuestionAttemptEntity,
} from '@modules/performance/domain/attempt.entity';
import { Between, EntityRepository, In } from 'typeorm';
import { RequestQuery } from '@core/libs/types';

@EntityRepository(AttemptEntity)
export class AttemptRepository extends BaseRepository<AttemptEntity> {
  findUserPeriodAttempts(performanceId: string, dateStart: string, dateEnd: string) {
    return this.find({
      where: {
        performanceId,
        createdAt: Between(dateStart, dateEnd),
      },
    });
  }

  findExpired() {
    return this.createQueryBuilder('attempt')
      .leftJoinAndSelect('attempt.performance', 'performance')
      .leftJoinAndSelect('performance.testSettings', 'testSettings')
      .leftJoinAndSelect('performance.courseSettings', 'courseSettings')
      .leftJoinAndSelect('attempt.user', 'user')
      .where(
        `(
          (testSettings.timeLimit IS NOT NULL AND testSettings.timeLimit > 0 AND attempt.createdAt + (testSettings.timeLimit * interval '1 minute') < now()) OR 
          (courseSettings.timeLimit IS NOT NULL AND courseSettings.timeLimit > 0 AND attempt.createdAt + (courseSettings.timeLimit * interval '1 minute') < now())
        )`,
      )
      .andWhere('attempt.isClosed = false')
      .getMany();
  }

  findUnusedAttempts() {
    return this.createQueryBuilder('attempt')
      .leftJoinAndSelect('attempt.performance', 'performance')
      .leftJoinAndSelect('performance.lastAttempt', 'lastAttempt')
      .leftJoinAndSelect('lastAttempt.questionAttempts', 'questionAttempts')
      .leftJoinAndSelect('performance.testSettings', 'testSettings')
      .where('attempt.isClosed = true')
      .getMany();
  }

  findByPerformanceIds(performanceIds: string[]) {
    return this.find({
      where: {
        performanceId: In(performanceIds)
      }
    })
  }
}

@EntityRepository(TestAttemptEntity)
export class TestAttemptRepository extends BaseRepository<TestAttemptEntity> {
  findByTestIdAndUserId(testId: string, userId: string) {
    return this.find({
      relations: ['test', 'user'],
      where: {
        user: {
          id: userId,
        },
        test: {
          id: testId,
        },
        isClosed: true,
      },
    });
  }

  findByPerformanceId(performanceId: string, { page, pageSize, sort }: RequestQuery) {
    return this.findAndCount({
      where: {
        performanceId,
      },
      ...this.processPaginationQuery(page, pageSize),
      ...this.processSortQuery(sort),
    });
  }

  findById(id: string) {
    return this.findOne({
      relations: ['performance', 'performance.testSettings', 'performance.test'],
      where: { id },
    });
  }

  findForViewAnswers(id: string) {
    return this.findOne({
      relations: [
        'questionAttempts',
        'questionAttempts.answerAttempts',
        'test',
        'performance',
        'performance.testSettings',
      ],
      where: { id },
    });
  }
}

@EntityRepository(CourseAttemptEntity)
export class CourseAttemptRepository extends BaseRepository<CourseAttemptEntity> {
  findByPerformanceId(performanceId: string, { page, pageSize, sort }: RequestQuery) {
    return this.findAndCount({
      where: {
        performanceId,
      },
      ...this.processPaginationQuery(page, pageSize),
      ...this.processSortQuery(sort),
    });
  }

  findLastByPerformanceId(performanceId: string) {
    return this.findOne({
      where: {
        performanceId,
      },
      order: { createdAt: 'DESC' },
    });
  }
}

@EntityRepository(TestQuestionAttemptEntity)
export class TestQuestionAttemptRepository extends BaseRepository<TestQuestionAttemptEntity> {}

@EntityRepository(AnswerAttemptEntity)
export class AnswerAttemptRepository extends BaseRepository<AnswerAttemptEntity> {}

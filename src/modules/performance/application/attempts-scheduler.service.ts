import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AttemptRepository } from '@modules/performance/infrastructure/database/attempt.repository';
import { Cron, CronExpression } from '@nestjs/schedule';
import { LoggerService } from '@core/logger/logger.service';
import { SubmitTestService } from '@modules/test/application/submit-test.service';
import { CourseAttemptEntity, TestAttemptEntity } from '@modules/performance/domain/attempt.entity';
import { SubmitCourseService } from '@modules/course/application/submit-course.service';

@Injectable()
export class AttemptsSchedulerService {
  constructor(
    @InjectRepository(AttemptRepository)
    private attemptRepository: AttemptRepository,
    private submitTestService: SubmitTestService,
    private submitCourseService: SubmitCourseService,
  ) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async closeExpiredAttempt() {
    try {
      const expiredAttempts = await this.attemptRepository.findExpired();
      if (expiredAttempts.length) {
        LoggerService.log('Found expired attempts. Start AttemptsSchedulerService', 'SCHEDULER');
        await Promise.all(
          expiredAttempts.map(attempt => {
            if (attempt instanceof TestAttemptEntity) {
              return this.submitTestService.submit(attempt.performanceId, attempt.user.id, true, attempt.id);
            } else if (attempt instanceof CourseAttemptEntity) {
              return this.submitCourseService.submit(attempt.performanceId, attempt.user.id, true);
            }
          }),
        );
      }
    } catch (e: any) {
      LoggerService.error(e?.message, e?.stack, 'SCHEDULER');
    }
  }
}

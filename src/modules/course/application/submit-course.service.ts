import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CoursePerformanceRepository,
  EducationProgramPerformanceRepository,
  PerformanceRepository,
} from '@modules/performance/infrastructure/database/performance.repository';
import { PerformanceException } from '@modules/performance/infrastructure/exceptions/performance.exception';
import { AttemptException } from '@modules/performance/infrastructure/exceptions/attempt.exception';
import { CourseAttemptRepository } from '@modules/performance/infrastructure/database/attempt.repository';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventActionEnum } from '@modules/event/application/create-event.service';
import { StartTrainingEvent } from '@modules/event/infrastructure/events/start-training.event';
import { CourseSuspendDataService } from '@modules/course/application/course-suspend-data.service';
import { PerformanceStatusEnum } from '@modules/performance/domain/performance.entity';
import { UpdateProgramPerformanceService } from '@modules/performance/application/update-program-performance.service';

@Injectable()
export class SubmitCourseService {
  constructor(
    @InjectRepository(CoursePerformanceRepository)
    private coursePerformanceRepository: CoursePerformanceRepository,
    @InjectRepository(CourseAttemptRepository)
    private courseAttemptRepository: CourseAttemptRepository,
    @InjectRepository(EducationProgramPerformanceRepository)
    private educationProgramPerformanceRepository: EducationProgramPerformanceRepository,
    @InjectRepository(PerformanceRepository)
    private performanceRepository: PerformanceRepository,
    private eventEmitter: EventEmitter2,
    private courseSuspendDataService: CourseSuspendDataService,
    private updateProgramPerformanceService: UpdateProgramPerformanceService
  ) {}

  async submit(performanceId: string, userId: string, scheduler?: boolean) {
    const coursePerformance = await this.coursePerformanceRepository.findByIdWithAttempt(performanceId);
    const courseAttempt = coursePerformance.lastAttempt;
    const settings = coursePerformance.courseSettings;
    if (!coursePerformance) PerformanceException.NotFound();
    if (!courseAttempt) AttemptException.NotFound();

    let timeSpent: number | undefined;
    if (settings.isTimeIsOver(courseAttempt.createdAt) && !courseAttempt.isClosed) {
      timeSpent = settings.timeLimit;
      courseAttempt.failCourse(timeSpent)
      coursePerformance.failCourse()
    } else if (!courseAttempt.isClosed) {
      courseAttempt.endCourse(scheduler);
      coursePerformance.endCourse(scheduler);
    }

    await Promise.all([
      this.coursePerformanceRepository.save(coursePerformance),
      this.courseAttemptRepository.save(courseAttempt),
      this.courseSuspendDataService.clearSuspendData(courseAttempt.id),
    ]);
    if (coursePerformance.performance_id) await this.updateProgramPerformanceService.update(coursePerformance.performance_id);
    !scheduler &&
      this.eventEmitter.emit(EventActionEnum.END_TRAINING, new StartTrainingEvent(userId, courseAttempt.id));
    return { success: true };
  }
}

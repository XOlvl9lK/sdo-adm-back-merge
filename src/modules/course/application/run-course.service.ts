import { Injectable } from '@nestjs/common';
import { RunCourseDto } from '@modules/performance/controllers/dtos/run-course.dto';
import { CoursePerformanceEntity, PerformanceStatusEnum } from '@modules/performance/domain/performance.entity';
import { EventActionEnum } from '@modules/event/application/create-event.service';
import { StartTrainingEvent } from '@modules/event/infrastructure/events/start-training.event';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CoursePerformanceRepository,
  EducationProgramPerformanceRepository
} from '@modules/performance/infrastructure/database/performance.repository';
import { UserRepository } from '@modules/user/infrastructure/database/user.repository';
import { CourseAttemptRepository } from '@modules/performance/infrastructure/database/attempt.repository';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserException } from '@modules/user/infrastructure/exceptions/user.exception';
import { CourseException } from '@modules/course/infrastructure/exceptions/course.exception';
import { CourseAttemptEntity } from '@modules/performance/domain/attempt.entity';
import { CourseRepository } from '@modules/course/infrastructure/database/course.repository';
import { SubmitCourseService } from '@modules/course/application/submit-course.service';
import { PerformanceException } from '@modules/performance/infrastructure/exceptions/performance.exception';

@Injectable()
export class RunCourseService {
  constructor(
    @InjectRepository(CoursePerformanceRepository)
    private coursePerformanceRepository: CoursePerformanceRepository,
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    @InjectRepository(CourseAttemptRepository)
    private courseAttemptRepository: CourseAttemptRepository,
    @InjectRepository(CourseRepository)
    private courseRepository: CourseRepository,
    @InjectRepository(EducationProgramPerformanceRepository)
    private educationProgramPerformanceRepository: EducationProgramPerformanceRepository,
    private eventEmitter: EventEmitter2,
    private submitCourseService: SubmitCourseService,
  ) {}

  async runCourseAttempt({ performanceId, userId, courseId }: RunCourseDto) {
    const coursePerformance = await this.coursePerformanceRepository.findByIdWithAttempt(performanceId);
    if (!coursePerformance.canRun) {
      PerformanceException.NotEnoughAttempts(
        'Мое расписание',
        `Пользователь id=${userId}. Попытка запустить курс с закончившимися попытками`,
      );
    }
    coursePerformance.runCourse();
    if (coursePerformance.performance) {
      if (!coursePerformance.performance.startDate) coursePerformance.performance.startDate = new Date()
      if (coursePerformance.performance.status === PerformanceStatusEnum.DID_NOT_OPEN) coursePerformance.performance.status = PerformanceStatusEnum.IN_PROGRESS
      coursePerformance.performance.lastOpened = new Date();
      await this.educationProgramPerformanceRepository.save(coursePerformance.performance)
    }
    const settings = coursePerformance.courseSettings;
    if (
      !coursePerformance?.lastAttempt ||
      coursePerformance?.lastAttempt.isClosed ||
      settings.isTimeIsOver(coursePerformance.lastAttempt?.createdAt)
    ) {
      if (settings.isTimeIsOver(coursePerformance.lastAttempt?.createdAt)) {
        await this.submitCourseService.submit(performanceId, userId, false);
      }
      const courseAttempt = await this.createCourseAttempt({
        courseId,
        userId,
        performance: coursePerformance,
      });
      coursePerformance.lastAttempt = courseAttempt;
      this.eventEmitter.emit(EventActionEnum.START_TRAINING, new StartTrainingEvent(userId, courseAttempt.id));
    }
    await this.coursePerformanceRepository.save(coursePerformance);

    return { success: true };
  }

  private async createCourseAttempt({
    userId,
    performance,
    courseId,
  }: {
    userId: string;
    performance: CoursePerformanceEntity;
    courseId: string;
  }) {
    const [user, course] = await Promise.all([
      this.userRepository.findById(userId),
      this.courseRepository.findById(courseId),
    ]);
    if (!user) UserException.NotFound('Зачисления');
    if (!course) CourseException.NotFound();
    const courseAttempt = new CourseAttemptEntity(user, performance, course);
    return await this.courseAttemptRepository.save(courseAttempt);
  }
}

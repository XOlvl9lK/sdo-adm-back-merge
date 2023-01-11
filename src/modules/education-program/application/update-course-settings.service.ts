import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CourseSettingsRepository } from '@modules/education-program/infrastructure/database/course-settings.repository';
import { UpdateCourseSettingsDto } from '@modules/education-program/controllers/dtos/update-course-settings.dto';
import { SettingsException } from '@modules/education-program/infrastructure/exceptions/settings.exception';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventActionEnum } from '@modules/event/application/create-event.service';
import { UpdateEntityEvent } from '@modules/event/infrastructure/events/update-entity.event';
import { AssignmentRepository } from '@modules/education-request/infrastructure/database/assignment.repository';

@Injectable()
export class UpdateCourseSettingsService {
  constructor(
    @InjectRepository(CourseSettingsRepository)
    private courseSettingsRepository: CourseSettingsRepository,
    @InjectRepository(AssignmentRepository)
    private assignmentRepository: AssignmentRepository,
    private eventEmitter: EventEmitter2,
  ) {}

  async update(
    {
      id,
      numberOfAttempts,
      timeLimit,
      isObligatory,
      startDate,
      endDate,
      assignmentId,
      certificateIssuance,
    }: UpdateCourseSettingsDto,
    userId: string,
  ) {
    const [courseSettings, assignment] = await Promise.all([
      this.courseSettingsRepository.findById(id),
      this.assignmentRepository.findById(assignmentId),
    ]);
    if (!courseSettings) SettingsException.NotFound();
    courseSettings.update(timeLimit, numberOfAttempts, isObligatory, startDate, endDate);
    if (assignment) {
      assignment.update(startDate, endDate, isObligatory, certificateIssuance);
      await this.assignmentRepository.save(assignment);
    }
    this.eventEmitter.emit(
      EventActionEnum.UPDATE_ENTITY,
      new UpdateEntityEvent('настройки курса', userId, 'Программы обучения', courseSettings),
    );
    return await this.courseSettingsRepository.save(courseSettings);
  }
}

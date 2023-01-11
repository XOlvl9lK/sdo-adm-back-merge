import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CourseSettingsRepository } from '@modules/education-program/infrastructure/database/course-settings.repository';
import { CourseSettingsEntity } from '@modules/education-program/domain/course-settings.entity';
import { UpdateCourseSettingsDto } from '@modules/education-program/controllers/dtos/update-course-settings.dto';

@Injectable()
export class CreateCourseSettingsService {
  constructor(
    @InjectRepository(CourseSettingsRepository)
    private courseSettingsRepository: CourseSettingsRepository,
  ) {}

  async create({
    timeLimit,
    numberOfAttempts,
    startDate,
    endDate,
    isObligatory
  }: Omit<UpdateCourseSettingsDto, 'id' | 'assignmentId'>) {
    const courseSettings = new CourseSettingsEntity(timeLimit, numberOfAttempts, isObligatory, startDate, endDate);
    return await this.courseSettingsRepository.save(courseSettings);
  }
}

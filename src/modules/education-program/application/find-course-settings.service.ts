import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CourseSettingsRepository } from '@modules/education-program/infrastructure/database/course-settings.repository';

@Injectable()
export class FindCourseSettingsService {
  constructor(
    @InjectRepository(CourseSettingsRepository)
    private courseSettingsRepository: CourseSettingsRepository,
  ) {}

  async findById(id: string) {
    return await this.courseSettingsRepository.findById(id);
  }
}

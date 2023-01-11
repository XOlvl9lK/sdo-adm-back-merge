import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProgramElementDto } from '@modules/education-program/controllers/dtos/create-program-element.dto';
import { CreateTestSettingsService } from '@modules/education-program/application/create-test-settings.service';
import {
  CourseProgramElementEntity,
  TestProgramElementEntity,
} from '@modules/education-program/domain/program-element.entity';
import { TestEntity } from '@modules/test/domain/test.entity';
import { CourseEntity } from '@modules/course/domain/course.entity';
import { EducationElementRepository } from '@modules/education-program/infrastructure/database/education-program.repository';
import { EducationElementTypeEnum } from '@modules/education-program/domain/education-element.entity';
import { CreateCourseSettingsService } from '@modules/education-program/application/create-course-settings.service';

@Injectable()
export class CreateProgramElementService {
  constructor(
    @InjectRepository(EducationElementRepository)
    private educationElementRepository: EducationElementRepository,
    private createTestSettingsService: CreateTestSettingsService,
    private createCourseSettingsService: CreateCourseSettingsService,
  ) {}

  async create({ educationElementId, order }: CreateProgramElementDto) {
    const educationElement = await this.educationElementRepository.findById(educationElementId);
    if (educationElement.elementType === EducationElementTypeEnum.TEST) {
      return await this.createTestProgramElement(educationElement as TestEntity, order);
    }
    if (educationElement.elementType === EducationElementTypeEnum.COURSE) {
      return await this.createCourseProgramElement(educationElement as CourseEntity, order);
    }
  }

  async createTestProgramElement(test: TestEntity, order: number) {
    const testSettings = await this.createTestSettingsService.create({
      timeLimit: test.duration,
    });
    return new TestProgramElementEntity(test, testSettings, order);
  }

  async createCourseProgramElement(course: CourseEntity, order: number) {
    const courseSettings = await this.createCourseSettingsService.create({
      timeLimit: course.duration,
    });
    return new CourseProgramElementEntity(course, courseSettings, order);
  }
}

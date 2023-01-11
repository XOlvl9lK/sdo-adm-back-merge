import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CourseRepository } from '@modules/course/infrastructure/database/course.repository';
import { RequestQuery } from '@core/libs/types';
import { ScormCourseService } from 'src/modules/course/infrastructure/scorm-course.service';
import { AssignmentRepository } from '@modules/education-request/infrastructure/database/assignment.repository';
import { EducationRequestStatusEnum } from '@modules/education-request/domain/education-request.entity';

@Injectable()
export class FindCourseService {
  constructor(
    @InjectRepository(CourseRepository)
    private courseRepository: CourseRepository,
    @InjectRepository(AssignmentRepository)
    private assignmentRepository: AssignmentRepository,
    private scormCourseService: ScormCourseService,
  ) {}

  async findAll(requestQuery: RequestQuery) {
    return await this.courseRepository.findAll(requestQuery);
  }

  async findById(id: string, userId?: string) {
    const course = await this.courseRepository.findById(id);
    const assignments = await this.assignmentRepository.findUserAssignmentByEducationElementInCatalog(
      userId,
      course.id,
    );
    return {
      ...course,
      requestStatuses: assignments.map(() => EducationRequestStatusEnum.ACCEPTED),
      filepath: await this.scormCourseService.getScormPathById(course.id),
    };
  }
}

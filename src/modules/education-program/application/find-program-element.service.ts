import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EducationElementRepository } from '@modules/education-program/infrastructure/database/education-program.repository';
import { RequestQuery } from '@core/libs/types';
import { ProgramElementRepository } from '@modules/education-program/infrastructure/database/program-element.repository';
import { AssignmentRepository } from '@modules/education-request/infrastructure/database/assignment.repository';
import { EducationRequestStatusEnum } from '@modules/education-request/domain/education-request.entity';
import { ThemeInTestRepository } from '@modules/test/infrastructure/database/test-theme.repository';
import { TestProgramElementEntity } from '@modules/education-program/domain/program-element.entity';

@Injectable()
export class FindProgramElementService {
  constructor(
    @InjectRepository(EducationElementRepository)
    private educationElementRepository: EducationElementRepository,
    @InjectRepository(ProgramElementRepository)
    private programElementRepository: ProgramElementRepository,
    @InjectRepository(AssignmentRepository)
    private assignmentRepository: AssignmentRepository,
    @InjectRepository(ThemeInTestRepository)
    private themeInTestRepository: ThemeInTestRepository,
  ) {}

  findAll(requestQuery: RequestQuery) {
    return this.educationElementRepository.findAllProgramElements(requestQuery);
  }

  async findCourseProgramElementById(id: string, userId?: string) {
    const course = await this.programElementRepository.findCourseElementById(id);
    const assignments = await this.assignmentRepository.findUserAssignmentByEducationElementInCatalog(
      userId,
      course?.educationProgram?.id,
    );
    return {
      ...course,
      requestStatuses: assignments.map(() => EducationRequestStatusEnum.ACCEPTED),
    };
  }

  async findTestProgramElementById(id: string, requestQuery: RequestQuery, userId?: string) {
    const test = await this.programElementRepository.findTestElementById(id) as TestProgramElementEntity;
    const [themes, total] = await this.themeInTestRepository.findByTestId(test.test.id, requestQuery)
    const assignments = await this.assignmentRepository.findUserAssignmentByEducationElementInCatalog(
      userId,
      test?.educationProgram?.id,
    );
    return {
      total,
      data: {
        ...test,
        test: {
          ...test.test,
          themes
        },
        requestStatuses: assignments.map(() => EducationRequestStatusEnum.ACCEPTED),
      }
    };
  }
}

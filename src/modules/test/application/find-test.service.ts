import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TestRepository } from '@modules/test/infrastructure/database/test.repository';
import { UserEducationRequestRepository } from '@modules/education-request/infrastructure/database/education-request.repository';
import { ThemeInTestRepository } from '@modules/test/infrastructure/database/test-theme.repository';
import { RequestQuery } from '@core/libs/types';
import { AssignmentRepository } from '@modules/education-request/infrastructure/database/assignment.repository';
import { EducationRequestStatusEnum } from '@modules/education-request/domain/education-request.entity';

@Injectable()
export class FindTestService {
  constructor(
    @InjectRepository(TestRepository)
    private testRepository: TestRepository,
    @InjectRepository(UserEducationRequestRepository)
    private userEducationRequestRepository: UserEducationRequestRepository,
    @InjectRepository(ThemeInTestRepository)
    private themeInTestRepository: ThemeInTestRepository,
    @InjectRepository(AssignmentRepository)
    private assignmentRepository: AssignmentRepository,
  ) {}

  async findAll(requestQuery: RequestQuery) {
    return this.testRepository.findAll(requestQuery);
  }

  async findById(id: string, requestQuery: RequestQuery, userId?: string) {
    const [test, [themes, total]] = await Promise.all([
      this.testRepository.findById(id),
      this.themeInTestRepository.findByTestId(id, requestQuery),
    ]);
    const assignments = await this.assignmentRepository.findUserAssignmentByEducationElementInCatalog(userId, test.id);
    return {
      total,
      data: {
        ...test,
        themes,
        requestStatuses: assignments.map(() => EducationRequestStatusEnum.ACCEPTED),
      },
    };
  }
}

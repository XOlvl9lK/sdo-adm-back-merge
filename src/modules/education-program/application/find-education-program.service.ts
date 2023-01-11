import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EducationProgramRepository } from '@modules/education-program/infrastructure/database/education-program.repository';
import { RequestQuery } from '@core/libs/types';
import { ProgramElementRepository } from '@modules/education-program/infrastructure/database/program-element.repository';
import { GroupingHelper } from '@modules/control/infrastructure/grouping.helper';
import { AssignmentRepository } from '@modules/education-request/infrastructure/database/assignment.repository';
import { EducationRequestStatusEnum } from '@modules/education-request/domain/education-request.entity';

@Injectable()
export class FindEducationProgramService {
  constructor(
    @InjectRepository(EducationProgramRepository)
    private educationProgramRepository: EducationProgramRepository,
    @InjectRepository(ProgramElementRepository)
    private programElementRepository: ProgramElementRepository,
    @InjectRepository(AssignmentRepository)
    private assignmentRepository: AssignmentRepository,
  ) {}

  async findAll(requestQuery: RequestQuery) {
    return await this.educationProgramRepository.findAll(requestQuery);
  }

  async findById(id: string) {
    return await this.educationProgramRepository.findByIdWithProgramElements(id);
  }

  async findByIdWithQuery(id: string, requestQuery: RequestQuery, userId?: string) {
    const [educationProgram, [programElements]] = await Promise.all([
      this.educationProgramRepository.findById(id),
      this.programElementRepository.findByProgramId(id, requestQuery),
    ]);
    const assignments = await this.assignmentRepository.findUserAssignmentByEducationElementInCatalog(
      userId,
      educationProgram.id,
    );
    const paginated = GroupingHelper.paginate(
      programElements
        .filter(pe => pe.educationProgram?.id === id)
        .filter(pe => {
          if (requestQuery.view === 'active') return !pe.isArchived;
          if (requestQuery.view === 'archive') return pe.isArchived;
          return true;
        }),
      requestQuery,
    );
    return {
      data: {
        ...educationProgram,
        programElements: paginated[0],
        requestStatuses: assignments.map(() => EducationRequestStatusEnum.ACCEPTED),
      },
      total: paginated[1],
    };
  }
}

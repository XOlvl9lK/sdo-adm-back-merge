import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AssignmentRepository } from '@modules/education-request/infrastructure/database/assignment.repository';
import { AssignmentGroupingService } from '@modules/education-request/domain/assignment-grouping.service';
import { RequestQuery } from '@core/libs/types';
import { GroupingHelper } from '@modules/control/infrastructure/grouping.helper';

@Injectable()
export class FindAssignmentService {
  constructor(
    @InjectRepository(AssignmentRepository)
    private assignmentRepository: AssignmentRepository,
  ) {}

  async findAll() {
    return await this.assignmentRepository.findAll();
  }

  async findById(id: string) {
    return this.assignmentRepository.findById(id);
  }

  async findAllGrouped(requestQuery: RequestQuery) {
    return await this.assignmentRepository.findAllGrouped(requestQuery);
  }

  async findByGroupIdOrUserId(id: string, requestQuery: RequestQuery) {
    return await this.assignmentRepository.findByGroupIdOrUserId(id, requestQuery);
  }
}

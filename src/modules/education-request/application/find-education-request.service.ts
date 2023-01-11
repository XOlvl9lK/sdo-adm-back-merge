import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  EducationRequestRepository,
  UserEducationRequestRepository,
} from '@modules/education-request/infrastructure/database/education-request.repository';
import { RequestGroupingService } from '@modules/education-request/domain/request-grouping.service';
import { EducationRequestStatusEnum } from '@modules/education-request/domain/education-request.entity';
import { RequestQuery } from '@core/libs/types';
import { GroupingHelper } from '@modules/control/infrastructure/grouping.helper';
import { UserException } from '@modules/user/infrastructure/exceptions/user.exception';

@Injectable()
export class FindEducationRequestService {
  constructor(
    @InjectRepository(EducationRequestRepository)
    private educationRequestRepository: EducationRequestRepository,
    @InjectRepository(UserEducationRequestRepository)
    private userEducationRequestRepository: UserEducationRequestRepository,
  ) {}

  async findAll(search?: string) {
    return await this.educationRequestRepository.findAll(search);
  }

  async findById(id: string, userId: string) {
    const request = await this.userEducationRequestRepository.findById(id);
    if (userId !== request.userId) UserException.Forbidden(`Пользователь ${userId}. Недостаточно прав`);
    return request;
  }

  async findAllByUserId(userId: string, requestQuery: RequestQuery) {
    return await this.userEducationRequestRepository.findAllByUserId(userId, requestQuery);
  }

  async findNotProcessedByUserId(userId: string, requestQuery: RequestQuery) {
    return await this.userEducationRequestRepository.findByUserIdAndStatus(
      userId,
      EducationRequestStatusEnum.NOT_PROCESSED,
      requestQuery,
    );
  }

  async findAcceptedByUserId(userId: string, requestQuery: RequestQuery) {
    return await this.userEducationRequestRepository.findByUserIdAndStatus(
      userId,
      EducationRequestStatusEnum.ACCEPTED,
      requestQuery,
    );
  }

  async findAllUsersRequests(requestQuery: RequestQuery) {
    return await this.userEducationRequestRepository.findAllUsersRequests(requestQuery);
  }

  async findUsersRequestsByUser(userId: string, requestQuery: RequestQuery) {
    return await this.userEducationRequestRepository.findByUserId(userId, requestQuery);
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupRepository, UserInGroupRepository } from '@modules/group/infrastructure/database/group.repository';
import { RequestQuery } from '@core/libs/types';
import { GetAllGroupsDto } from '@modules/group/controllers/dtos/get-all-groups.dto';
import { LoggerService } from '@core/logger/logger.service';

@Injectable()
export class FindGroupService {
  constructor(
    @InjectRepository(GroupRepository)
    private groupRepository: GroupRepository,
    @InjectRepository(UserInGroupRepository)
    private userInGroupRepository: UserInGroupRepository,
  ) {}

  async findAll(requestQuery: RequestQuery, filter?: GetAllGroupsDto) {
    return await this.groupRepository.findAll(requestQuery, filter);
  }

  async findById(id: string, requestQuery: RequestQuery) {
    const [group, [users, total]] = await Promise.all([
      this.groupRepository.findById(id),
      this.userInGroupRepository.findByGroupId(id, requestQuery),
    ]);
    return {
      total,
      data: {
        ...group,
        users,
      },
    };
  }

  async findByIdWithoutPagination(id: string) {
    return await this.groupRepository.findById(id);
  }

  async findByUserId(userId: string) {
    const groupsByUserId = await this.userInGroupRepository.findByUserId(userId)
    return groupsByUserId.map(g => g.group)
  }
}

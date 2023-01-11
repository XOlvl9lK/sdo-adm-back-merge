import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '@modules/user/infrastructure/database/user.repository';
import { GroupRepository } from '@modules/group/infrastructure/database/group.repository';
import { RequestQuery } from '@core/libs/types';

@Injectable()
export class FindMultipleEntitiesService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    @InjectRepository(GroupRepository)
    private groupRepository: GroupRepository,
  ) {}

  async findAllGroupsAndUsers(requestQuery: RequestQuery) {
    return await this.userRepository.findEducables(requestQuery)
  }
}

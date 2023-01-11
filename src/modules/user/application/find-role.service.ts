import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleRepository } from '@modules/user/infrastructure/database/role.repository';
import { RequestQuery } from '@core/libs/types';
import { UserRepository } from '@modules/user/infrastructure/database/user.repository';

@Injectable()
export class FindRoleService {
  constructor(
    @InjectRepository(RoleRepository)
    private roleRepository: RoleRepository,
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  async findAll(requestQuery: RequestQuery) {
    return await this.roleRepository.findAll(requestQuery);
  }

  async findById(id: string) {
    return await this.roleRepository.findById(id);
  }

  async findByIdWithUser(id: string, requestQuery: RequestQuery) {
    const [role, [usersByRole, total]] = await Promise.all([
      this.roleRepository.findById(id),
      this.userRepository.findByRoleId(id, requestQuery),
    ]);
    return {
      total,
      data: {
        role,
        usersByRole,
      },
    };
  }

  async findAbsentUsers(id: string, requestQuery: RequestQuery) {
    return await this.userRepository.findExcludeRoleId(id, requestQuery);
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '@modules/user/infrastructure/database/user.repository';
import {
  DepartmentRepository,
  RegionRepository,
  RoleDibRepository,
  SubdivisionRepository,
} from '@modules/authority/infrastructure/database/authority.repository';
import { RoleRepository } from '@modules/user/infrastructure/database/role.repository';
import { GroupRepository } from '@modules/group/infrastructure/database/group.repository';
import { RequestQuery } from '@core/libs/types';
import { UserException } from '@modules/user/infrastructure/exceptions/user.exception';
import { orderBy } from 'lodash';

@Injectable()
export class FindUserService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    @InjectRepository(DepartmentRepository)
    private departmentRepository: DepartmentRepository,
    @InjectRepository(RegionRepository)
    private regionRepository: RegionRepository,
    @InjectRepository(SubdivisionRepository)
    private subdivisionRepository: SubdivisionRepository,
    @InjectRepository(RoleRepository)
    private roleRepository: RoleRepository,
    @InjectRepository(RoleDibRepository)
    private roleDibRepository: RoleDibRepository,
    @InjectRepository(GroupRepository)
    private groupRepository: GroupRepository,
  ) {}

  async findAll(requestQuery: RequestQuery) {
    return this.userRepository.findAll(requestQuery);
  }

  async findAllMinimal(requestQuery: RequestQuery) {
    const [data, total] = await this.userRepository.findAllSortedByLoginAndFullName(requestQuery);

    return [
      data.map(({ id, login, fullName, firstName, middleName, lastName }) => ({
        id,
        login,
        fullName,
        firstName,
        middleName,
        lastName,
      })),
      total,
    ];
  }

  async findById(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) UserException.NotFound('Пользователи');
    return user;
  }

  async findCreateOptions() {
    const [roles, departments, rolesDib] = await Promise.all([
      this.roleRepository.find(),
      this.departmentRepository.find(),
      this.roleDibRepository.find(),
    ]);
    return {
      roles,
      departments,
      rolesDib,
    };
  }

  async findImportOption() {
    const [roles, groups] = await Promise.all([this.roleRepository.find(), this.groupRepository.find()]);
    return {
      roles,
      groups,
    };
  }

  async findToAddInGroup(groupId: string, search?: string) {
    const [users, group] = await Promise.all([
      this.userRepository.findAll({ search, view: 'active' }),
      this.groupRepository.findById(groupId),
    ]);
    return users[0].filter(user => !group.alreadyInGroup(user.id));
  }
}

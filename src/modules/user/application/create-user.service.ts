import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@modules/user/domain/user.entity';
import { UserRepository } from '@modules/user/infrastructure/database/user.repository';
import { CreateUserDto } from '@modules/user/controllers/dtos/create-user.dto';
import { UserException } from '@modules/user/infrastructure/exceptions/user.exception';
import { RoleRepository } from '@modules/user/infrastructure/database/role.repository';
import {
  DepartmentRepository,
  RegionRepository,
  RoleDibRepository,
  SubdivisionRepository,
} from '@modules/authority/infrastructure/database/authority.repository';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventActionEnum } from '@modules/event/application/create-event.service';
import { CreateEntityEvent } from '@modules/event/infrastructure/events/create-entity.event';
import { UpdateUserService } from '@modules/user/application/update-user.service';
import { DibUsersImportEvent } from '@modules/event/infrastructure/events/dib-users-import.event';

@Injectable()
export class CreateUserService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    @InjectRepository(RoleRepository)
    private roleRepository: RoleRepository,
    @InjectRepository(DepartmentRepository)
    private departmentRepository: DepartmentRepository,
    @InjectRepository(RegionRepository)
    private regionRepository: RegionRepository,
    @InjectRepository(SubdivisionRepository)
    private subdivisionRepository: SubdivisionRepository,
    @InjectRepository(RoleDibRepository)
    private roleDibRepository: RoleDibRepository,
    private eventEmitter: EventEmitter2,
    private updateUserService: UpdateUserService,
  ) {}

  async create(
    {
      login,
      password,
      roleId,
      roleDibId,
      subdivisionId,
      email,
      firstName,
      lastName,
      gender,
      middleName,
      institution,
      organization,
      departmentId,
      regionId,
      validityTo,
      validityFrom,
      isPersonalDataRequired,
    }: CreateUserDto,
    userId: string,
    overwrite?: boolean,
  ) {
    const candidate = await this.userRepository.findByLogin(login);
    if (candidate && overwrite) {
      return await this.updateUserService.update(
        {
          id: candidate.id,
          login,
          roleId,
          roleDibId,
          subdivisionId,
          departmentId,
          regionId,
          validityFrom,
          validityTo,
        },
        userId,
      );
    } else if (candidate) {
      UserException.AlreadyExists('Создание пользователя', `Пользователь с логином=${candidate.login} уже существует`);
    }

    const [role, department, region, subdivision, roleDib] = await Promise.all([
      this.roleRepository.findById(roleId),
      this.departmentRepository.findById(departmentId),
      this.regionRepository.findById(regionId),
      this.subdivisionRepository.findById(subdivisionId),
      this.roleDibRepository.findById(roleDibId),
    ]);
    const user = new UserEntity(
      login,
      password,
      role,
      firstName,
      lastName,
      email,
      middleName,
      organization,
      institution,
      validityFrom ? new Date(validityFrom) : null,
      validityTo ? new Date(validityTo) : null,
      gender,
      isPersonalDataRequired,
      department,
      region,
      subdivision,
      roleDib,
    );
    this.eventEmitter.emit(
      EventActionEnum.CREATE_ENTITY,
      new CreateEntityEvent('пользователя', userId, user.id, 'Пользователи'),
    );
    if (roleDib) {
      await this.eventEmitter.emitAsync(EventActionEnum.DIB_USERS_IMPORT, new DibUsersImportEvent([user]))
    }
    return await this.userRepository.save(user);
  }
}

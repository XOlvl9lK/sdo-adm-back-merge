import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '@modules/user/infrastructure/database/user.repository';
import { UpdateUserDto } from '@modules/user/controllers/dtos/update-user.dto';
import { RoleRepository } from '@modules/user/infrastructure/database/role.repository';
import {
  DepartmentRepository,
  RegionRepository,
  RoleDibRepository,
  SubdivisionRepository,
} from '@modules/authority/infrastructure/database/authority.repository';
import { UserException } from '@modules/user/infrastructure/exceptions/user.exception';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventActionEnum } from '@modules/event/application/create-event.service';
import { UpdateEntityEvent } from '@modules/event/infrastructure/events/update-entity.event';
import { UpdateProfileDto } from '@modules/user/controllers/dtos/update-profile.dto';
import { DibUsersImportEvent } from '@modules/event/infrastructure/events/dib-users-import.event';
import { TryCatch } from '@core/libs/try-catch.decorator';

@Injectable()
export class UpdateUserService {
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
  ) {}

  @TryCatch({ async: true })
  async update(
    {
      id,
      roleId,
      departmentId,
      regionId,
      subdivisionId,
      roleDibId,
      password,
      firstName,
      lastName,
      gender,
      middleName,
      institution,
      organization,
      validityFrom,
      validityTo,
      email,
      isPersonalDataRequired,
    }: UpdateUserDto,
    userId: string,
  ) {
    const [user, role, department, region, subdivision, roleDib] = await Promise.all([
      this.userRepository.findById(id),
      this.roleRepository.findById(roleId),
      this.departmentRepository.findById(departmentId),
      this.regionRepository.findById(regionId),
      this.subdivisionRepository.findById(subdivisionId),
      this.roleDibRepository.findById(roleDibId),
    ]);
    if (!user) UserException.NotFound('Пользователи');
    const roleFrom = user.role;
    roleFrom.decreaseTotalUsers();
    role.increaseTotalUsers();
    user.update(
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
      isPersonalDataRequired,
      gender,
      department,
      region,
      subdivision,
      roleDib || null,
    );
    await this.eventEmitter.emitAsync(
      EventActionEnum.UPDATE_ENTITY,
      new UpdateEntityEvent('данные пользователя', userId, 'Профиль', user),
    );
    if (roleDib) {
      await this.eventEmitter.emitAsync(EventActionEnum.DIB_USERS_IMPORT, new DibUsersImportEvent([user]))
    }
    await this.roleRepository.save([roleFrom, role]);
    return await this.userRepository.save(user);
  }

  async updateProfile({
    id,
    firstName,
    lastName,
    gender,
    middleName,
    institution,
    organization,
    password,
    email,
    oldPassword,
  }: UpdateProfileDto) {
    const user = await this.userRepository.findById(id);
    if (!user) UserException.NotFound('Профиль');
    if (password) {
      if (oldPassword && !user.isPasswordValid(oldPassword))
        UserException.InvalidPassword('Профиль', `Пользователь '${user.login}' ввел неверный пароль`);
      if (user.isPasswordValid(password))
        UserException.SamePassword('Профиль', `Старый и новый пароли пользователя '${user.login}' совпадают`);
    }
    user.updateProfile(firstName, lastName, middleName, email, organization, institution, gender, password);
    this.eventEmitter.emit(
      EventActionEnum.UPDATE_ENTITY,
      new UpdateEntityEvent('данные пользователя', id, 'Профиль', user),
    );
    return await this.userRepository.save(user);
  }
}

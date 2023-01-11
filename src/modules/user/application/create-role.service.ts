import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleRepository } from '@modules/user/infrastructure/database/role.repository';
import { CreateRoleDto } from '@modules/user/controllers/dtos/create-role.dto';
import { RoleEntity } from '@modules/user/domain/role.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventActionEnum } from '@modules/event/application/create-event.service';
import { CreateEntityEvent } from '@modules/event/infrastructure/events/create-entity.event';
import { BaseException } from '@core/exceptions/base.exception';
import { RoleException } from '@modules/user/infrastructure/exceptions/role.exception';

@Injectable()
export class CreateRoleService {
  constructor(
    @InjectRepository(RoleRepository)
    private roleRepository: RoleRepository,
    private eventEmitter: EventEmitter2,
  ) {}

  async create({ title, description, parentRoleId }: CreateRoleDto, userId) {
    if (await this.roleRepository.isAlreadyExists(title))
      RoleException.AlreadyExists(
        'Роли и права',
        `Пользователь id=${userId}. Попытка создания неуникальной роли ${title}`,
      );
    const parentRole = await this.roleRepository.findById(parentRoleId);
    const role = new RoleEntity(title, description, parentRole);
    this.eventEmitter.emit(
      EventActionEnum.CREATE_ENTITY,
      new CreateEntityEvent('роль', userId, role.id, 'Роли и права'),
    );
    return await this.roleRepository.save(role);
  }
}

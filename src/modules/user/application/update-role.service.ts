import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleRepository } from '@modules/user/infrastructure/database/role.repository';
import { UpdateRoleDto } from '@modules/user/controllers/dtos/update-role.dto';
import { RoleException } from '@modules/user/infrastructure/exceptions/role.exception';
import { MoveUsersDto } from '@modules/user/controllers/dtos/move-users.dto';
import { UserRepository } from '@modules/user/infrastructure/database/user.repository';
import { UserException } from '@modules/user/infrastructure/exceptions/user.exception';
import { UpdatePermissionsDto } from '@modules/user/controllers/dtos/update-permissions.dto';
import { PermissionRepository } from '@modules/user/infrastructure/database/permission.repository';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventActionEnum } from '@modules/event/application/create-event.service';
import { UpdateEntityEvent } from '@modules/event/infrastructure/events/update-entity.event';
import { RoleEntity } from '@modules/user/domain/role.entity';

interface IGroupedRolesFrom {
  total: number;
  role: RoleEntity;
}

@Injectable()
export class UpdateRoleService {
  constructor(
    @InjectRepository(RoleRepository)
    private roleRepository: RoleRepository,
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    @InjectRepository(PermissionRepository)
    private permissionRepository: PermissionRepository,
    private eventEmitter: EventEmitter2,
  ) {}

  async update({ id, title, description }: UpdateRoleDto, userId: string) {
    const role = await this.roleRepository.findById(id);
    if (!role) RoleException.NotFound('Роли и права');
    role.update(title, description);
    this.eventEmitter.emit(EventActionEnum.UPDATE_ENTITY, new UpdateEntityEvent('роль', userId, 'Роли и права', role));
    return await this.roleRepository.save(role);
  }

  async moveUsers({ roleTo, userIds }: MoveUsersDto) {
    const [role, users] = await Promise.all([
      this.roleRepository.findById(roleTo),
      this.userRepository.findByIds(userIds),
    ]);
    if (!role) RoleException.NotFound('Роли и права');
    if (!users.length) UserException.NotFound('Роли и права');

    let rolesFrom = users.map(u => u.role);
    const groupedRolesFrom = rolesFrom.reduce<IGroupedRolesFrom[]>((result, role) => {
      const inResult = result.find(r => r.role.id === role.id);
      if (inResult) {
        inResult.total++;
      } else {
        result.push({
          role,
          total: 1,
        });
      }
      return result;
    }, []);
    rolesFrom = groupedRolesFrom.map(r => {
      r.role.decreaseTotalUsers(r.total);
      return r.role;
    });
    users.forEach(user => (user.role = role));
    role.increaseTotalUsers(users.length);
    return await Promise.all([this.roleRepository.save([role, ...rolesFrom]), this.userRepository.save(users)]);
  }

  async updatePermissions({ permissionsIds, roleId }: UpdatePermissionsDto) {
    const [role, permissions] = await Promise.all([
      this.roleRepository.findById(roleId),
      this.permissionRepository.findByIds(permissionsIds),
    ]);
    if (!role) RoleException.NotFound('Роли и права');
    role.permissions = permissions;
    return await this.roleRepository.save(role);
  }
}

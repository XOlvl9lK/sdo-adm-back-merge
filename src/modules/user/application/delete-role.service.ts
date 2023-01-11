import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleRepository } from '@modules/user/infrastructure/database/role.repository';
import { DeleteManyRoleDto } from '@modules/user/controllers/dtos/delete-many-role.dto';
import { RoleException } from '@modules/user/infrastructure/exceptions/role.exception';

@Injectable()
export class DeleteRoleService {
  constructor(
    @InjectRepository(RoleRepository)
    private roleRepository: RoleRepository,
  ) {}

  async deleteMany({ ids }: DeleteManyRoleDto, userId: string) {
    const roles = await this.roleRepository.findForDelete(ids);
    for (const role of roles) {
      Number.parseInt(role.userCount) > 0 &&
        RoleException.RolesHasUsers(
          'Роли и права',
          `Пользователь id=${userId}. Попытка удаления роли id=${role.id} c назначенными пользователями`,
        );
      Number.parseInt(role.childCount) > 0 &&
        RoleException.HasChildRoles(
          'Роли и права',
          `Пользователь id=${userId}. Попытка удаления роли id=${role.id} c дочерними ролями`,
        );
      !role.isRemovable &&
        RoleException.NotRemovableRoles(
          'Роли и права',
          `Пользователь id=${userId}. Попытка удаления системной роли id=${role.id}`,
        );
    }
    await this.roleRepository.delete(roles.map(({ id }) => id));
    return { success: true };
  }
}

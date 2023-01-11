import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { ContentEntity } from '@core/domain/content.entity';
import { PermissionEntity } from '@modules/user/domain/permission.entity';

@Entity('role')
export class RoleEntity extends ContentEntity {
  @Column({
    type: 'boolean',
    default: true,
    name: 'is_removable',
    comment: 'Признак возможности удаления',
  })
  isRemovable: boolean;

  @ManyToOne(() => RoleEntity, {
    cascade: true,
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'parent_role_id' })
  parentRole: RoleEntity;

  @Column({
    nullable: true,
    name: 'parent_role_id',
    comment: 'ID родительской роли',
  })
  parentRoleId: string;

  @ManyToMany(() => PermissionEntity, {
    cascade: true,
    onUpdate: 'CASCADE',
  })
  @JoinTable()
  permissions: PermissionEntity[];

  @Column({
    type: 'int',
    default: 0,
    name: 'total_users',
    comment: 'Количество пользователей с данной ролью',
  })
  totalUsers: number;

  constructor(title: string, description?: string, parentRole?: RoleEntity) {
    super(title, description);
    this.parentRole = parentRole;
    if (parentRole?.permissions) {
      this.permissions = parentRole.permissions;
    }
  }

  addPermissions(permissions: PermissionEntity[]) {
    if (this.permissions) {
      this.permissions.push(...permissions);
    } else {
      this.permissions = permissions;
    }
  }

  increaseTotalUsers(count?: number) {
    if (count) {
      this.totalUsers += count;
    } else {
      this.totalUsers++;
    }
  }

  decreaseTotalUsers(count?: number) {
    if (count) {
      this.totalUsers -= count;
    } else {
      this.totalUsers--;
    }
  }

  update(title: string, description?: string) {
    this.title = title.trim();
    this.description = description ? description.trim() : null;
  }
}

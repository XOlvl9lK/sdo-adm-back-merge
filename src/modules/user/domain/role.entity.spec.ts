import { Random } from '@core/test/random';
import { PermissionEntity, PermissionEnum } from '@modules/user/domain/permission.entity';
import { plainToInstance } from 'class-transformer';
import { mockBaseEntity } from '@core/domain/base.entity.mock';
import { RoleEntity } from '@modules/user/domain/role.entity';

const mockPermission = {
  ...mockBaseEntity,
  code: PermissionEnum.CONTROL,
  description: 'Доступ к разделу "Контроль"',
};

export const mockPermissionInstance = plainToInstance(PermissionEntity, mockPermission);

const mockRole = {
  ...mockBaseEntity,
  isRemovable: false,
  permissions: [mockPermissionInstance],
  totalUsers: 1,
  title: Random.lorem,
  description: Random.lorem,
};

export const mockRoleInstance = plainToInstance(RoleEntity, mockRole);

describe('RoleEntity', () => {
  test('Should add permissions', () => {
    mockRoleInstance.addPermissions([mockPermissionInstance]);

    expect(mockRoleInstance.permissions).toEqual([mockPermissionInstance, mockPermissionInstance]);
    mockRoleInstance.permissions = [mockPermissionInstance];
  });

  test('Should increase totalUsers', () => {
    mockRoleInstance.increaseTotalUsers();

    expect(mockRoleInstance.totalUsers).toBe(2);
    mockRoleInstance.totalUsers--;
  });

  test('Should decrease totalUsers', () => {
    mockRoleInstance.decreaseTotalUsers();

    expect(mockRoleInstance.totalUsers).toBe(0);
    mockRoleInstance.totalUsers++;
  });

  test('Should update title and description', () => {
    mockRoleInstance.update('Role title', 'Role description');

    expect(mockRoleInstance.title).toBe('Role title');
    expect(mockRoleInstance.description).toBe('Role description');

    mockRoleInstance.update(Random.lorem, Random.lorem);
  });
});

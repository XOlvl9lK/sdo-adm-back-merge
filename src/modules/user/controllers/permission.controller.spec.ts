import { TestHelper } from '@core/test/test.helper';
import { CreatePermissionService } from '@modules/user/application/create-permission.service';
import { FindPermissionService } from '@modules/user/application/find-permission.service';
import { mockPermissionInstance } from '@modules/user/domain/role.entity.spec';
import { PermissionController } from '@modules/user/controllers/permission.controller';
import { Random } from '@core/test/random';
import { PermissionEnum } from '@modules/user/domain/permission.entity';

const helpers = new TestHelper(
  { type: 'createService', provide: CreatePermissionService },
  {
    type: 'findService',
    provide: FindPermissionService,
    mockValue: mockPermissionInstance,
  },
);

describe('PermissionController', () => {
  let permissionController: PermissionController;

  beforeAll(async () => {
    [permissionController] = await helpers.beforeAll([PermissionController]);
  });

  test('Should return all permissions', async () => {
    const result = await permissionController.getAll({});

    expect(result).toEqual({
      data: [mockPermissionInstance],
      total: Random.number,
    });
  });

  test('Should call create service', async () => {
    await permissionController.create({
      code: PermissionEnum.CONTROL,
      description: Random.lorem,
    });

    const mockCreatePermissionService = helpers.getProviderValueByToken('CreatePermissionService');

    expect(mockCreatePermissionService.create).toHaveBeenCalledTimes(1);
    expect(mockCreatePermissionService.create).toHaveBeenCalledWith({
      code: PermissionEnum.CONTROL,
      description: Random.lorem,
    });
  });
});

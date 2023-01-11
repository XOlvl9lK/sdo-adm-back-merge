import { TestHelper } from '@core/test/test.helper';
import { CreateRoleService } from '@modules/user/application/create-role.service';
import { FindRoleService } from '@modules/user/application/find-role.service';
import { mockRoleInstance } from '@modules/user/domain/role.entity.spec';
import { UpdateRoleService } from '@modules/user/application/update-role.service';
import { DeleteRoleService } from '@modules/user/application/delete-role.service';
import { RoleController } from '@modules/user/controllers/role.controller';
import { Random } from '@core/test/random';
import { mockUserInstance } from '@modules/user/domain/user.entity.spec';
import clearAllMocks = jest.clearAllMocks;

const helpers = new TestHelper(
  { type: 'createService', provide: CreateRoleService },
  {
    type: 'findService',
    provide: FindRoleService,
    mockValue: mockRoleInstance,
    extend: [
      {
        method: 'findByIdWithUser',
        mockImplementation: jest.fn().mockResolvedValue({
          total: Random.number,
          data: { role: mockRoleInstance, usersByRole: [mockUserInstance] },
        }),
      },
      {
        method: 'findAbsentUsers',
        mockImplementation: jest.fn().mockResolvedValue([[mockUserInstance], Random.number]),
      },
    ],
  },
  {
    type: 'updateService',
    provide: UpdateRoleService,
    extend: [
      { method: 'moveUsers', mockImplementation: jest.fn() },
      { method: 'updatePermissions', mockImplementation: jest.fn() },
      { method: 'deleteMany', mockImplementation: jest.fn() },
    ],
  },
  { type: 'deleteService', provide: DeleteRoleService },
);

describe('RoleController', () => {
  let roleController: RoleController;

  beforeAll(async () => {
    [roleController] = await helpers.beforeAll([RoleController]);
  });

  test('Should return all permissions', async () => {
    const result = await roleController.getAll({});

    expect(result).toEqual({
      data: [mockRoleInstance],
      total: Random.number,
    });
  });

  test('Should return role by id with users', async () => {
    const result = await roleController.getByIdWithUsers(Random.id, {});

    expect(result).toEqual({
      total: Random.number,
      data: { role: mockRoleInstance, usersByRole: [mockUserInstance] },
    });
  });

  test('Should return role absent users', async () => {
    const result = await roleController.getAbsentUsers(Random.id, {});

    expect(result).toEqual({
      data: [mockUserInstance],
      total: Random.number,
    });
  });

  test('Should return role by id', async () => {
    const result = await roleController.getById(Random.id);

    expect(result).toEqual(mockRoleInstance);
  });

  test('Should call create service', async () => {
    await roleController.create({ title: Random.lorem }, Random.id);

    const mockCreateRoleService = helpers.getProviderValueByToken('CreateRoleService');

    expect(mockCreateRoleService.create).toHaveBeenCalledTimes(1);
    expect(mockCreateRoleService.create).toHaveBeenCalledWith({ title: Random.lorem }, Random.id);
  });

  test('Should call update service', async () => {
    await roleController.update({ id: Random.id, title: 'Title' }, Random.id);

    const mockUpdateRoleService = helpers.getProviderValueByToken('UpdateRoleService');

    expect(mockUpdateRoleService.update).toHaveBeenCalledTimes(1);
    expect(mockUpdateRoleService.update).toHaveBeenCalledWith({ id: Random.id, title: 'Title' }, Random.id);
  });

  test('Should call moveUsers', async () => {
    await roleController.moveUsers({ roleTo: Random.id, userIds: Random.ids });

    const mockUpdateRoleService = helpers.getProviderValueByToken('UpdateRoleService');

    expect(mockUpdateRoleService.moveUsers).toHaveBeenCalledTimes(1);
    expect(mockUpdateRoleService.moveUsers).toHaveBeenCalledWith({
      roleTo: Random.id,
      userIds: Random.ids,
    });
  });

  test('Should call updatePermissions', async () => {
    await roleController.updatePermissions({
      roleId: Random.id,
      permissionsIds: Random.ids,
    });

    const mockUpdateRoleService = helpers.getProviderValueByToken('UpdateRoleService');

    expect(mockUpdateRoleService.updatePermissions).toHaveBeenCalledTimes(1);
    expect(mockUpdateRoleService.updatePermissions).toHaveBeenCalledWith({
      roleId: Random.id,
      permissionsIds: Random.ids,
    });
  });

  test('Should call deleteMany', async () => {
    await roleController.deleteMany({ ids: Random.ids });

    const mockDeleteRoleService = helpers.getProviderValueByToken('DeleteRoleService');

    expect(mockDeleteRoleService.deleteMany).toHaveBeenCalledTimes(1);
    expect(mockDeleteRoleService.deleteMany).toHaveBeenCalledWith({
      ids: Random.ids,
    });
  });

  afterEach(() => {
    clearAllMocks();
  });
});

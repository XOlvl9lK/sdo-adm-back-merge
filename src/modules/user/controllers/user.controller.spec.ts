import { TestHelper } from '@core/test/test.helper';
import { CreateUserService } from '@modules/user/application/create-user.service';
import { FindUserService } from '@modules/user/application/find-user.service';
import {
  mockDepartmentInstance,
  mockRegionInstance,
  mockRoleDibInstance,
  mockSubdivisionInstance,
  mockUserInstance,
} from '@modules/user/domain/user.entity.spec';
import { mockRoleInstance } from '@modules/user/domain/role.entity.spec';
import { mockGroupInstance } from '@modules/group/domain/group.entity.spec';
import { UpdateUserService } from '@modules/user/application/update-user.service';
import { UserController } from '@modules/user/controllers/user.controller';
import { ImportDibUserService } from '@modules/user/application/import-dib-user.service';
import { ImportUserService } from '@modules/user/application/import-user.service';
import { Random } from '@core/test/random';
import clearAllMocks = jest.clearAllMocks;

const helpers = new TestHelper(
  { type: 'createService', provide: CreateUserService },
  {
    type: 'findService',
    provide: FindUserService,
    mockValue: mockUserInstance,
    extend: [
      {
        method: 'findCreateOptions',
        mockImplementation: jest.fn().mockResolvedValue({
          roles: [mockRoleInstance],
          regions: [mockRegionInstance],
          departments: [mockDepartmentInstance],
          subdivisions: [mockSubdivisionInstance],
          rolesDib: [mockRoleDibInstance],
        }),
      },
      {
        method: 'findImportOption',
        mockImplementation: jest.fn().mockResolvedValue({
          roles: [mockRoleInstance],
          groups: [mockGroupInstance],
        }),
      },
      {
        method: 'findToAddInGroup',
        mockImplementation: jest.fn().mockResolvedValue([mockUserInstance]),
      },
    ],
  },
  {
    type: 'updateService',
    provide: UpdateUserService,
    extend: [{ method: 'updateProfile', mockImplementation: jest.fn() }],
  },
);

describe('UserController', () => {
  let userController: UserController;

  beforeAll(async () => {
    [userController] = await helpers.beforeAll(
      [UserController],
      [
        {
          provide: ImportDibUserService,
          useValue: {
            validateUsersForImport: jest.fn(),
            importUsers: jest.fn(),
          },
        },
        {
          provide: ImportUserService,
          useValue: {
            validateUsers: jest.fn(),
            importUsers: jest.fn(),
          },
        },
      ],
    );
  });

  test('Should return all users', async () => {
    const result = await userController.getAll({});

    expect(result).toEqual({
      data: [mockUserInstance],
      total: Random.number,
    });
  });

  test('Should return current user', async () => {
    const result = await userController.getCurrent(Random.id);

    expect(result).toEqual(mockUserInstance);
  });

  test('Should return create options', async () => {
    const result = await userController.getCreateOptions();

    expect(result).toEqual({
      roles: [mockRoleInstance],
      regions: [mockRegionInstance],
      departments: [mockDepartmentInstance],
      subdivisions: [mockSubdivisionInstance],
      rolesDib: [mockRoleDibInstance],
    });
  });

  test('Should return import options', async () => {
    const result = await userController.getImportOptions();

    expect(result).toEqual({
      roles: [mockRoleInstance],
      groups: [mockGroupInstance],
    });
  });

  test('Should return user by id', async () => {
    const result = await userController.getById(Random.id);

    expect(result).toEqual(mockUserInstance);
  });

  test('Should return users to add in group', async () => {
    const result = await userController.getUsersToAddInGroup(Random.id, Random.lorem);

    expect(result).toEqual([mockUserInstance]);
  });

  test('Should call create service', async () => {
    await userController.create({ login: Random.lorem, roleId: Random.id }, Random.id);

    const mockCreateUserService = helpers.getProviderValueByToken('CreateUserService');

    expect(mockCreateUserService.create).toHaveBeenCalledTimes(1);
    expect(mockCreateUserService.create).toHaveBeenCalledWith({ login: Random.lorem, roleId: Random.id }, Random.id);
  });

  test('Should call update', async () => {
    await userController.update({ login: Random.lorem, roleId: Random.id, id: Random.id }, Random.id);

    const mockUpdateUserService = helpers.getProviderValueByToken('UpdateUserService');

    expect(mockUpdateUserService.update).toHaveBeenCalledTimes(1);
    expect(mockUpdateUserService.update).toHaveBeenCalledWith(
      { login: Random.lorem, roleId: Random.id, id: Random.id },
      Random.id,
    );
  });

  test('Should call updateProfile', async () => {
    await userController.updateProfile({
      id: Random.id,
      firstName: Random.firstName,
      lastName: Random.lastName,
    });

    const mockUpdateUserService = helpers.getProviderValueByToken('UpdateUserService');

    expect(mockUpdateUserService.updateProfile).toHaveBeenCalledTimes(1);
    expect(mockUpdateUserService.updateProfile).toHaveBeenCalledWith({
      id: Random.id,
      firstName: Random.firstName,
      lastName: Random.lastName,
    });
  });

  afterEach(() => {
    clearAllMocks();
  });
});

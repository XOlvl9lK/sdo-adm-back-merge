import { roleRepositoryMockProvider, TestHelper, userRepositoryMockProvider } from '@core/test/test.helper';
import { UpdateRoleService } from '@modules/user/application/update-role.service';
import { Test } from '@nestjs/testing';
import { PermissionRepository } from '@modules/user/infrastructure/database/permission.repository';
import { mockPermissionInstance, mockRoleInstance } from '@modules/user/domain/role.entity.spec';
import { Random } from '@core/test/random';
import clearAllMocks = jest.clearAllMocks;
import { plainToInstance } from 'class-transformer';
import { RoleEntity } from '@modules/user/domain/role.entity';

const helpers = new TestHelper(roleRepositoryMockProvider, userRepositoryMockProvider, {
  type: 'repository',
  provide: PermissionRepository,
  mockValue: mockPermissionInstance,
});

describe('UpdateRoleService', () => {
  let updateRoleService: UpdateRoleService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [UpdateRoleService, ...helpers.mockProviders, helpers.eventEmitterMockProvider],
    }).compile();

    updateRoleService = moduleRef.get(UpdateRoleService);
  });

  test('Should update role in database and emit', async () => {
    await updateRoleService.update({ id: Random.id, title: 'Title', description: 'Description' }, Random.id);

    const mockRoleRepository = helpers.getProviderByToken('RoleRepository').useValue;

    expect(mockRoleRepository.save).toHaveBeenCalledTimes(1);
    expect(mockRoleRepository.save).toHaveBeenCalledWith(
      plainToInstance(RoleEntity, {
        ...mockRoleInstance,
        title: 'Title',
        description: 'Description',
      }),
    );
    expect(helpers.eventEmitterMockProvider.useValue.emit).toHaveBeenCalledTimes(1);
  });

  test('Should move users and save result in database', async () => {
    await updateRoleService.moveUsers({
      roleTo: Random.id,
      userIds: Random.ids,
    });

    const mockRoleRepository = helpers.getProviderByToken('RoleRepository').useValue;
    const mockUserRepository = helpers.getProviderByToken('UserRepository').useValue;

    expect(mockRoleRepository.save).toHaveBeenCalledTimes(1);
    expect(mockUserRepository.save).toHaveBeenCalledTimes(1);
  });

  test('Should update role permissions', async () => {
    await updateRoleService.updatePermissions({
      permissionsIds: Random.ids,
      roleId: Random.id,
    });

    const mockRoleRepository = helpers.getProviderByToken('RoleRepository').useValue;

    expect(mockRoleRepository.save).toHaveBeenCalledTimes(1);
    expect(mockRoleRepository.save).toHaveBeenCalledWith(
      plainToInstance(RoleEntity, {
        ...mockRoleInstance,
        permissions: [mockPermissionInstance],
      }),
    );
  });

  afterEach(() => {
    clearAllMocks();
  });
});

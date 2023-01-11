import { roleRepositoryMockProvider, TestHelper } from '@core/test/test.helper';
import { DeleteRoleService } from '@modules/user/application/delete-role.service';
import { Test } from '@nestjs/testing';
import { Random } from '@core/test/random';
import { RoleRepository } from '@modules/user/infrastructure/database/role.repository';
import { mockRoleInstance } from '@modules/user/domain/role.entity.spec';

const helpers = new TestHelper(roleRepositoryMockProvider);

describe('DeleteRoleService', () => {
  let deleteRoleService: DeleteRoleService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [DeleteRoleService, ...helpers.mockProviders],
    }).compile();

    deleteRoleService = moduleRef.get(DeleteRoleService);
  });

  test('Should delete role from database', async () => {
    await deleteRoleService.deleteMany({ ids: Random.ids });

    const mockRoleRepository = helpers.getProviderByToken('RoleRepository').useValue;

    expect(mockRoleRepository.remove).toHaveBeenCalled();
  });

  test('Should throw an error if users > 0', async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        DeleteRoleService,
        {
          provide: RoleRepository,
          useValue: {
            remove: jest.fn(),
            findForDelete: jest.fn().mockResolvedValue([{ ...mockRoleInstance, users: 5 }]),
          },
        },
      ],
    }).compile();

    deleteRoleService = moduleRef.get(DeleteRoleService);

    await expect(async () => {
      await deleteRoleService.deleteMany({ ids: Random.ids });
    }).rejects.toThrow();
  });
});

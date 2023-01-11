import { roleRepositoryMockProvider, TestHelper, userRepositoryMockProvider } from '@core/test/test.helper';
import { FindRoleService } from '@modules/user/application/find-role.service';
import { Test } from '@nestjs/testing';
import { mockRoleInstance } from '@modules/user/domain/role.entity.spec';
import { Random } from '@core/test/random';
import { mockUserInstance } from '@modules/user/domain/user.entity.spec';

const helpers = new TestHelper(userRepositoryMockProvider, roleRepositoryMockProvider);

describe('FindRoleService', () => {
  let findRoleService: FindRoleService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [FindRoleService, ...helpers.mockProviders],
    }).compile();

    findRoleService = moduleRef.get(FindRoleService);
  });

  test('Should return all roles', async () => {
    const result = await findRoleService.findAll({});

    expect(result).toEqual([[mockRoleInstance], Random.number]);
  });

  test('Should return role by id', async () => {
    const result = await findRoleService.findById(Random.id);

    expect(result).toEqual(mockRoleInstance);
  });

  test('Should return role by id with users', async () => {
    const result = await findRoleService.findByIdWithUser(Random.id, {});

    expect(result).toEqual({
      total: Random.number,
      data: {
        role: mockRoleInstance,
        usersByRole: [mockUserInstance],
      },
    });
  });

  test('Should return absent users', async () => {
    const result = await findRoleService.findAbsentUsers(Random.id, {});

    const mockUserRepository = helpers.getProviderByToken('UserRepository').useValue;

    expect(mockUserRepository.findExcludeRoleId).toHaveBeenCalled();
    expect(result).toEqual([[mockUserInstance], Random.number]);
  });
});

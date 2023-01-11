import { roleRepositoryMockProvider, TestHelper } from '@core/test/test.helper';
import { CreateRoleService } from '@modules/user/application/create-role.service';
import { Test } from '@nestjs/testing';
import { Random } from '@core/test/random';
import clearAllMocks = jest.clearAllMocks;
import { RoleEntity } from '@modules/user/domain/role.entity';
import { mockRoleInstance } from '@modules/user/domain/role.entity.spec';
jest.mock('@modules/user/domain/role.entity');
//@ts-ignore
RoleEntity.mockImplementation(() => mockRoleInstance);

const helpers = new TestHelper(roleRepositoryMockProvider);

describe('CreateRoleService', () => {
  let createRoleService: CreateRoleService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [CreateRoleService, ...helpers.mockProviders, helpers.eventEmitterMockProvider],
    }).compile();

    createRoleService = moduleRef.get(CreateRoleService);
  });

  test('Should save role in database and emit', async () => {
    await createRoleService.create(
      {
        title: 'Role title',
      },
      Random.id,
    );

    const mockRoleRepository = helpers.getProviderByToken('RoleRepository').useValue;

    expect(mockRoleRepository.save).toHaveBeenCalledTimes(1);
    expect(mockRoleRepository.save).toHaveBeenCalledWith(mockRoleInstance);
    expect(helpers.eventEmitterMockProvider.useValue.emit).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    clearAllMocks();
  });
});

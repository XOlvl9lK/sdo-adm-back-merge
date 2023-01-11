import { CreateUserService } from '@modules/user/application/create-user.service';
import { Test } from '@nestjs/testing';
import { UserRepository } from '@modules/user/infrastructure/database/user.repository';
import {
  departmentRepositoryMockProvider,
  regionRepositoryMockProvider,
  roleDibRepositoryMockProvider,
  roleRepositoryMockProvider,
  subdivisionRepositoryMockProvider,
  TestHelper,
  userRepositoryMockProvider,
} from '@core/test/test.helper';
import { mockUser, mockUserInstance } from '@modules/user/domain/user.entity.spec';
import { UpdateUserService } from '@modules/user/application/update-user.service';
import { Random } from '@core/test/random';
import clearAllMocks = jest.clearAllMocks;
import { UserEntity } from '@modules/user/domain/user.entity';
jest.mock('@modules/user/domain/user.entity');
//@ts-ignore
UserEntity.mockImplementation(() => mockUserInstance);

const helpers = new TestHelper(
  userRepositoryMockProvider,
  roleRepositoryMockProvider,
  departmentRepositoryMockProvider,
  regionRepositoryMockProvider,
  subdivisionRepositoryMockProvider,
  roleDibRepositoryMockProvider,
);

describe('CreateUserService', () => {
  let createUserService: CreateUserService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        CreateUserService,
        ...helpers.mockProviders,
        helpers.eventEmitterMockProvider,
        {
          provide: UpdateUserService,
          useValue: {
            update: jest.fn().mockResolvedValue(mockUserInstance),
          },
        },
      ],
    }).compile();

    createUserService = moduleRef.get(CreateUserService);
  });

  test('Should save user in database and emit', async () => {
    await createUserService.create(
      {
        ...mockUser,
        roleId: Random.id,
        validityFrom: Random.datePast.toISOString(),
        validityTo: Random.dateFuture.toISOString(),
      },
      Random.id,
    );

    const mockUserRepository = helpers.getProviderByToken('UserRepository').useValue;

    expect(mockUserRepository.save).toHaveBeenCalledTimes(1);
    expect(mockUserRepository.save).toHaveBeenCalledWith(mockUserInstance);
    expect(helpers.eventEmitterMockProvider.useValue.emit).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    clearAllMocks();
  });
});

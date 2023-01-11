import {
  departmentRepositoryMockProvider,
  regionRepositoryMockProvider,
  roleDibRepositoryMockProvider,
  roleRepositoryMockProvider,
  subdivisionRepositoryMockProvider,
  TestHelper,
  userRepositoryMockProvider,
} from '@core/test/test.helper';
import { UpdateUserService } from '@modules/user/application/update-user.service';
import { Test } from '@nestjs/testing';
import { mockUser, mockUserInstance } from '@modules/user/domain/user.entity.spec';
import { Random } from '@core/test/random';
import clearAllMocks = jest.clearAllMocks;

const helpers = new TestHelper(
  userRepositoryMockProvider,
  roleRepositoryMockProvider,
  departmentRepositoryMockProvider,
  regionRepositoryMockProvider,
  subdivisionRepositoryMockProvider,
  roleDibRepositoryMockProvider,
);

describe('UpdateUserService', () => {
  let updateUserService: UpdateUserService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [UpdateUserService, ...helpers.mockProviders, helpers.eventEmitterMockProvider],
    }).compile();

    updateUserService = moduleRef.get(UpdateUserService);
  });

  test('Should update user in database and emit', async () => {
    await updateUserService.update(
      {
        ...mockUser,
        validityFrom: Random.datePast.toISOString(),
        validityTo: Random.datePast.toISOString(),
        roleId: Random.id,
      },
      Random.id,
    );

    const mockUserRepository = helpers.getProviderByToken('UserRepository').useValue;

    expect(mockUserRepository.save).toHaveBeenCalledTimes(1);
    expect(helpers.eventEmitterMockProvider.useValue.emit).toHaveBeenCalledTimes(1);
  });

  test('Should update profile', async () => {
    const updateProfileSpy = jest.spyOn(mockUserInstance, 'updateProfile');
    await updateUserService.updateProfile({
      ...mockUser,
      password: 'asdzxc',
    });

    const mockUserRepository = helpers.getProviderByToken('UserRepository').useValue;

    expect(mockUserRepository.save).toHaveBeenCalledTimes(1);
    expect(updateProfileSpy).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    clearAllMocks();
  });
});

import {
  departmentRepositoryMockProvider,
  groupRepositoryMockProvider,
  regionRepositoryMockProvider,
  roleDibRepositoryMockProvider,
  roleRepositoryMockProvider,
  subdivisionRepositoryMockProvider,
  TestHelper,
  userRepositoryMockProvider,
} from '@core/test/test.helper';
import { FindUserService } from '@modules/user/application/find-user.service';
import { Test } from '@nestjs/testing';
import {
  mockDepartmentInstance,
  mockRegionInstance,
  mockRoleDibInstance,
  mockSubdivisionInstance,
  mockUserInstance,
} from '@modules/user/domain/user.entity.spec';
import { Random } from '@core/test/random';
import { mockRoleInstance } from '@modules/user/domain/role.entity.spec';
import { mockGroupInstance } from '@modules/group/domain/group.entity.spec';

const helpers = new TestHelper(
  userRepositoryMockProvider,
  departmentRepositoryMockProvider,
  regionRepositoryMockProvider,
  subdivisionRepositoryMockProvider,
  roleDibRepositoryMockProvider,
  roleRepositoryMockProvider,
  groupRepositoryMockProvider,
);

describe('FindUserService', () => {
  let findUserService: FindUserService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [FindUserService, ...helpers.mockProviders],
    }).compile();

    findUserService = moduleRef.get(FindUserService);
  });

  test('Should return all users', async () => {
    const result = await findUserService.findAll({});

    expect(result).toEqual([[mockUserInstance], Random.number]);
  });

  test('Should return user by id', async () => {
    const result = await findUserService.findById(Random.id);

    expect(result).toEqual(mockUserInstance);
  });

  test('Should return create options', async () => {
    const result = await findUserService.findCreateOptions();

    expect(result).toEqual({
      roles: [mockRoleInstance],
      departments: [mockDepartmentInstance],
      regions: [mockRegionInstance],
      subdivisions: [mockSubdivisionInstance],
      rolesDib: [mockRoleDibInstance],
    });
  });

  test('Should return import options', async () => {
    const result = await findUserService.findImportOption();

    expect(result).toEqual({
      roles: [mockRoleInstance],
      groups: [mockGroupInstance],
    });
  });

  // test('Should return users to add in group', async () => {
  //
  // })
});

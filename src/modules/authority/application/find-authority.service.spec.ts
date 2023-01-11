import {
  departmentRepositoryMockProvider,
  regionRepositoryMockProvider,
  roleDibRepositoryMockProvider,
  subdivisionRepositoryMockProvider,
  TestHelper,
} from '@core/test/test.helper';
import { FindAuthorityService } from '@modules/authority/application/find-authority.service';
import {
  mockDepartmentInstance,
  mockRegionInstance,
  mockRoleDibInstance,
  mockSubdivisionInstance,
} from '@modules/user/domain/user.entity.spec';

const helpers = new TestHelper(
  roleDibRepositoryMockProvider,
  departmentRepositoryMockProvider,
  subdivisionRepositoryMockProvider,
  regionRepositoryMockProvider,
);

describe('FindAuthorityService', () => {
  let findAuthorityService: FindAuthorityService;

  beforeAll(async () => {
    [findAuthorityService] = await helpers.beforeAll([FindAuthorityService]);
  });

  test('Should return all roles dib', async () => {
    const result = await findAuthorityService.findRoleDib();

    expect(result).toEqual([mockRoleDibInstance]);
  });

  test('Should return all departments', async () => {
    const result = await findAuthorityService.findDepartment();

    expect(result).toEqual([mockDepartmentInstance]);
  });

  test('Should return all subdivisions', async () => {
    const result = await findAuthorityService.findSubdivision();

    expect(result).toEqual([mockSubdivisionInstance]);
  });

  test('Should return all regions', async () => {
    const result = await findAuthorityService.findRegion();

    expect(result).toEqual([mockRegionInstance]);
  });
});

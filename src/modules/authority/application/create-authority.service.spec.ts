import {
  departmentRepositoryMockProvider,
  regionRepositoryMockProvider,
  roleDibRepositoryMockProvider,
  subdivisionRepositoryMockProvider,
  TestHelper,
} from '@core/test/test.helper';
import { CreateAuthorityService } from '@modules/authority/application/create-authority.service';
import { Random } from '@core/test/random';
import { DepartmentEntity } from '@modules/authority/domain/department.entity';
import {
  mockDepartmentInstance,
  mockRegionInstance,
  mockRoleDibInstance,
  mockSubdivisionInstance,
} from '@modules/user/domain/user.entity.spec';
import { RegionEntity } from '@modules/authority/domain/region.entity';
import { SubdivisionEntity } from '@modules/authority/domain/subdivision.entity';
import { RoleDibEntity } from '@modules/authority/domain/role-dib.entity';
jest.mock('@modules/authority/domain/department.entity');
//@ts-ignore
DepartmentEntity.mockImplementation(() => mockDepartmentInstance);
jest.mock('@modules/authority/domain/region.entity');
//@ts-ignore
RegionEntity.mockImplementation(() => mockRegionInstance);
jest.mock('@modules/authority/domain/subdivision.entity');
//@ts-ignore
SubdivisionEntity.mockImplementation(() => mockSubdivisionInstance);
jest.mock('@modules/authority/domain/role-dib.entity');
//@ts-ignore
RoleDibEntity.mockImplementation(() => mockRoleDibInstance);

const helpers = new TestHelper(
  departmentRepositoryMockProvider,
  regionRepositoryMockProvider,
  subdivisionRepositoryMockProvider,
  roleDibRepositoryMockProvider,
);

describe('CreateAuthorityService', () => {
  let createAuthorityService: CreateAuthorityService;

  beforeAll(async () => {
    [createAuthorityService] = await helpers.beforeAll([CreateAuthorityService]);
  });

  test('Should create department', async () => {
    await createAuthorityService.createDepartment({ title: Random.lorem });

    const mockDepartmentRepository = helpers.getProviderValueByToken('DepartmentRepository');

    expect(mockDepartmentRepository.save).toHaveBeenCalledTimes(1);
    expect(mockDepartmentRepository.save).toHaveBeenCalledWith(mockDepartmentInstance);
  });

  test('Should create region', async () => {
    await createAuthorityService.createRegion({ title: Random.lorem });

    const mockRegionRepository = helpers.getProviderValueByToken('RegionRepository');

    expect(mockRegionRepository.save).toHaveBeenCalledTimes(1);
    expect(mockRegionRepository.save).toHaveBeenCalledWith(mockRegionInstance);
  });

  test('Should create subdivision', async () => {
    await createAuthorityService.createSubdivision({ title: Random.lorem });

    const mockSubdivisionRepository = helpers.getProviderValueByToken('SubdivisionRepository');

    expect(mockSubdivisionRepository.save).toHaveBeenCalledTimes(1);
    expect(mockSubdivisionRepository.save).toHaveBeenCalledWith(mockSubdivisionInstance);
  });

  test('Should create role dib', async () => {
    await createAuthorityService.createRoleDib({ title: Random.lorem });

    const mockRoleDibRepository = helpers.getProviderValueByToken('RoleDibRepository');

    expect(mockRoleDibRepository.save).toHaveBeenCalledTimes(1);
    expect(mockRoleDibRepository.save).toHaveBeenCalledWith(mockRoleDibInstance);
  });
});

import { TestHelper } from '@core/test/test.helper';
import { PermissionRepository } from '@modules/user/infrastructure/database/permission.repository';
import { mockPermissionInstance } from '@modules/user/domain/role.entity.spec';
import { FindPermissionService } from '@modules/user/application/find-permission.service';
import { Test } from '@nestjs/testing';
import { Random } from '@core/test/random';

const helpers = new TestHelper({
  type: 'repository',
  provide: PermissionRepository,
  mockValue: mockPermissionInstance,
});

describe('FindPermissionService', () => {
  let findPermissionService: FindPermissionService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [FindPermissionService, ...helpers.mockProviders],
    }).compile();

    findPermissionService = moduleRef.get(FindPermissionService);
  });

  test('Should return permissions', async () => {
    const result = await findPermissionService.findAll({});

    expect(result).toEqual([[mockPermissionInstance], Random.number]);
  });
});

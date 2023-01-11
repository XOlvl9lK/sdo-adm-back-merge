import { groupRepositoryMockProvider, TestHelper, userInGroupRepositoryMockProvider } from '@core/test/test.helper';
import { FindGroupService } from '@modules/group/application/find-group.service';
import { mockGroupInstance, mockUserInGroupInstance } from '@modules/group/domain/group.entity.spec';
import { Random } from '@core/test/random';

const helpers = new TestHelper(groupRepositoryMockProvider, userInGroupRepositoryMockProvider);

describe('FindGroupService', () => {
  let findGroupService: FindGroupService;

  beforeAll(async () => {
    [findGroupService] = await helpers.beforeAll([FindGroupService]);
  });

  test('Should return all groups and count', async () => {
    const result = await findGroupService.findAll({});

    expect(result).toEqual([[mockGroupInstance], Random.number]);
  });

  test('Should return group by id and count', async () => {
    const result = await findGroupService.findById(Random.id, {});

    expect(result).toEqual({
      total: Random.number,
      data: {
        ...mockGroupInstance,
        users: [mockUserInGroupInstance],
      },
    });
  });

  test('Should return group by id without pagination', async () => {
    const result = await findGroupService.findByIdWithoutPagination(Random.id);

    expect(result).toEqual(mockGroupInstance);
  });
});

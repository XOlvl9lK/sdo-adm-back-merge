import { groupRepositoryMockProvider, TestHelper, userRepositoryMockProvider } from '@core/test/test.helper';
import { FindMultipleEntitiesService } from '@modules/other/application/find-multiple-entities.service';
import { mockUserInstance } from '@modules/user/domain/user.entity.spec';
import { mockGroupInstance } from '@modules/group/domain/group.entity.spec';

const helpers = new TestHelper(userRepositoryMockProvider, groupRepositoryMockProvider);

describe('FindMultipleEntitiesService', () => {
  let findMultipleEntitiesService: FindMultipleEntitiesService;

  beforeAll(async () => {
    [findMultipleEntitiesService] = await helpers.beforeAll([FindMultipleEntitiesService]);
  });

  test('Should return all groups and users', async () => {
    const result = await findMultipleEntitiesService.findAllGroupsAndUsers();

    expect(result).toEqual(
      [mockUserInstance, mockGroupInstance].map(el => ({
        ...el,
        type: 'title' in el ? 'GROUP' : 'USER',
      })),
    );
  });
});

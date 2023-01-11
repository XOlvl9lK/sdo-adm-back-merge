import { forumRepositoryMockProvider, TestHelper } from '@core/test/test.helper';
import { DeleteForumService } from '@modules/forum/application/delete-forum.service';
import { Random } from '@core/test/random';
import { mockForumInstance } from '@modules/forum/domain/forum.entity.spec';

const helpers = new TestHelper(forumRepositoryMockProvider);

describe('DeleteForumService', () => {
  let deleteForumService: DeleteForumService;

  beforeAll(async () => {
    [deleteForumService] = await helpers.beforeAll([DeleteForumService]);
  });

  test('Should delete forum', async () => {
    await deleteForumService.delete(Random.id);

    const mockForumRepository = helpers.getProviderValueByToken('ForumRepository');

    expect(mockForumInstance.isDeleted).toBe(true);
    expect(mockForumRepository.save).toHaveBeenCalledTimes(1);
    expect(mockForumRepository.save).toHaveBeenCalledWith(mockForumInstance);
  });
});

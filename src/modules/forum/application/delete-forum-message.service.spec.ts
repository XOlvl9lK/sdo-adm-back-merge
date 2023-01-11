import { forumMessageRepositoryMockProvider, TestHelper } from '@core/test/test.helper';
import { DeleteForumMessageService } from '@modules/forum/application/delete-forum-message.service';
import { Random } from '@core/test/random';
import { mockForumMessageInstance } from '@modules/forum/domain/forum-message.entity.spec';

const helpers = new TestHelper(forumMessageRepositoryMockProvider);

describe('DeleteForumMessageService', () => {
  let deleteForumMessageService: DeleteForumMessageService;

  beforeAll(async () => {
    [deleteForumMessageService] = await helpers.beforeAll([DeleteForumMessageService]);
  });

  test('Should delete forum message', async () => {
    await deleteForumMessageService.delete(Random.id);

    const mockForumMessageRepository = helpers.getProviderValueByToken('ForumMessageRepository');

    expect(mockForumMessageRepository.remove).toHaveBeenCalledTimes(1);
    expect(mockForumMessageRepository.remove).toHaveBeenCalledWith(mockForumMessageInstance);
  });
});

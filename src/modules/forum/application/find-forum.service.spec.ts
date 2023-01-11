import { forumRepositoryMockProvider, TestHelper } from '@core/test/test.helper';
import { FindForumService } from '@modules/forum/application/find-forum.service';
import { mockForumInstance } from '@modules/forum/domain/forum.entity.spec';
import { Random } from '@core/test/random';

const helpers = new TestHelper(forumRepositoryMockProvider);

describe('FindForumService', () => {
  let findForumService: FindForumService;

  beforeAll(async () => {
    [findForumService] = await helpers.beforeAll([FindForumService]);
  });

  test('Should return all forums', async () => {
    const result = await findForumService.findAll();

    expect(result).toEqual([mockForumInstance]);
  });

  test('Should return forum by id', async () => {
    const result = await findForumService.findById(Random.id);

    expect(result).toEqual(mockForumInstance);
  });
});

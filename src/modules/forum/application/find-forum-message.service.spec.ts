import { forumMessageRepositoryMockProvider, TestHelper, themeRepositoryMockProvider } from '@core/test/test.helper';
import { FindForumMessageService } from '@modules/forum/application/find-forum-message.service';
import { Random } from '@core/test/random';
import { mockForumMessageInstance } from '@modules/forum/domain/forum-message.entity.spec';
import { mockThemeInstance } from '@modules/forum/domain/theme.entity.spec';

const helpers = new TestHelper(forumMessageRepositoryMockProvider, themeRepositoryMockProvider);

describe('FindForumMessageService', () => {
  let findForumMessageService: FindForumMessageService;

  beforeAll(async () => {
    [findForumMessageService] = await helpers.beforeAll([FindForumMessageService]);
  });

  test('Should return all forum messages', async () => {
    const result = await findForumMessageService.findAll(Random.lorem);

    expect(result).toEqual([mockForumMessageInstance]);
  });

  test('Should return forum messages by themeId', async () => {
    const result = await findForumMessageService.findByThemeId(Random.id, {});

    expect(result).toEqual({
      total: Random.number,
      data: {
        theme: mockThemeInstance,
        forumMessages: [mockForumMessageInstance],
      },
    });
  });

  test('Should return forum message by id', async () => {
    const result = await findForumMessageService.findById(Random.id);

    expect(result).toEqual(mockForumMessageInstance);
  });
});

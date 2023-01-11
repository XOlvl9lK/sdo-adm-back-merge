import { forumRepositoryMockProvider, TestHelper, themeRepositoryMockProvider } from '@core/test/test.helper';
import { ThemeCreatedEventHandler } from '@modules/forum/application/theme-created.event-handler';
import { Random } from '@core/test/random';

const helpers = new TestHelper(forumRepositoryMockProvider, themeRepositoryMockProvider);

describe('ThemeCreatedEventHandler', () => {
  let themeCreatedEventHandler: ThemeCreatedEventHandler;

  beforeAll(async () => {
    [themeCreatedEventHandler] = await helpers.beforeAll([ThemeCreatedEventHandler]);
  });

  test('Should handle', async () => {
    await themeCreatedEventHandler.handle({
      themeId: Random.id,
      forumId: Random.id,
    });

    const mockForumRepository = helpers.getProviderValueByToken('ForumRepository');

    expect(mockForumRepository.save).toHaveBeenCalledTimes(1);
  });
});

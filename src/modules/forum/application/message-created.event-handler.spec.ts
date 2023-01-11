import {
  forumMessageRepositoryMockProvider,
  forumRepositoryMockProvider,
  TestHelper,
  themeRepositoryMockProvider,
} from '@core/test/test.helper';
import { MessageCreatedEventHandler } from '@modules/forum/application/message-created.event-handler';
import { Random } from '@core/test/random';

const helpers = new TestHelper(
  forumMessageRepositoryMockProvider,
  themeRepositoryMockProvider,
  forumRepositoryMockProvider,
);

describe('MessageCreatedEventHandler', () => {
  let messageCreatedEventHandler: MessageCreatedEventHandler;

  beforeAll(async () => {
    [messageCreatedEventHandler] = await helpers.beforeAll([MessageCreatedEventHandler]);
  });

  test('Should handle event', async () => {
    await messageCreatedEventHandler.handle({
      themeId: Random.id,
      messageId: Random.id,
    });

    const mockThemeRepository = helpers.getProviderValueByToken('ThemeRepository');
    const mockForumRepository = helpers.getProviderValueByToken('ForumRepository');

    expect(mockThemeRepository.save).toHaveBeenCalledTimes(1);
    expect(mockForumRepository.save).toHaveBeenCalledTimes(1);
  });
});

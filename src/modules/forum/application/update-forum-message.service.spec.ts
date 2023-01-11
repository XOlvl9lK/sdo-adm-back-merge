import { forumMessageRepositoryMockProvider, TestHelper, themeRepositoryMockProvider } from '@core/test/test.helper';
import { UpdateForumMessageService } from '@modules/forum/application/update-forum-message.service';
import { Random } from '@core/test/random';
import { EventActionEnum } from '@modules/event/application/create-event.service';
import { UpdateEntityEvent } from '@modules/event/infrastructure/events/update-entity.event';
import { mockForumMessageInstance } from '@modules/forum/domain/forum-message.entity.spec';
import clearAllMocks = jest.clearAllMocks;

const helpers = new TestHelper(forumMessageRepositoryMockProvider, themeRepositoryMockProvider);

describe('UpdateForumMessageService', () => {
  let updateForumMessageService: UpdateForumMessageService;

  beforeAll(async () => {
    [updateForumMessageService] = await helpers.beforeAll([UpdateForumMessageService]);
  });

  test('Should update forum message and emit', async () => {
    await updateForumMessageService.update(
      {
        id: Random.id,
        content: Random.lorem,
      },
      Random.id,
    );

    const mockEventEmitter = helpers.getProviderValueByToken('EventEmitter2');
    const mockForumMessageRepository = helpers.getProviderValueByToken('ForumMessageRepository');

    expect(mockEventEmitter.emit).toHaveBeenCalledTimes(1);
    expect(mockEventEmitter.emit).toHaveBeenCalledWith(
      EventActionEnum.UPDATE_ENTITY,
      new UpdateEntityEvent('сообщение форума', Random.id, 'Форум', mockForumMessageInstance),
    );
    expect(mockForumMessageRepository.save).toHaveBeenCalledTimes(1);
    expect(mockForumMessageRepository.save).toHaveBeenCalledWith(mockForumMessageInstance);
  });

  test('Should move forum message', async () => {
    await updateForumMessageService.moveForumMessage({
      id: Random.id,
      themeIdTo: Random.id,
      setFirst: false,
    });

    const mockForumMessageRepository = helpers.getProviderValueByToken('ForumMessageRepository');
    const mockThemeRepository = helpers.getProviderValueByToken('ThemeRepository');

    expect(mockForumMessageRepository.save).toHaveBeenCalledTimes(1);
    expect(mockThemeRepository.save).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    clearAllMocks();
  });
});

import {
  forumMessageRepositoryMockProvider,
  TestHelper,
  themeRepositoryMockProvider,
  userRepositoryMockProvider,
} from '@core/test/test.helper';
import { CreateForumMessageService } from '@modules/forum/application/create-forum-message.service';
import { Random } from '@core/test/random';
import { ForumMessageEntity } from '@modules/forum/domain/forum-message.entity';
import { mockForumMessageInstance } from '@modules/forum/domain/forum-message.entity.spec';
import { EventActionEnum } from '@modules/event/application/create-event.service';
import { ForumMessageCreatedEvent } from '@modules/event/infrastructure/events/forum-message-created.event';
import { CreateEntityEvent } from '@modules/event/infrastructure/events/create-entity.event';
jest.mock('@modules/forum/domain/forum-message.entity');
//@ts-ignore
ForumMessageEntity.mockImplementation(() => mockForumMessageInstance);

const helpers = new TestHelper(
  forumMessageRepositoryMockProvider,
  userRepositoryMockProvider,
  themeRepositoryMockProvider,
);

describe('CreateForumMessageService', () => {
  let createForumMessageService: CreateForumMessageService;

  beforeAll(async () => {
    [createForumMessageService] = await helpers.beforeAll([CreateForumMessageService]);
  });

  test('Should create forum message and emit twice', async () => {
    await createForumMessageService.create(
      {
        authorId: Random.id,
        themeId: Random.id,
        message: Random.lorem,
      },
      Random.id,
    );

    const mockForumMessageRepository = helpers.getProviderValueByToken('ForumMessageRepository');
    const mockEventEmitter = helpers.getProviderValueByToken('EventEmitter2');

    expect(mockEventEmitter.emit).toHaveBeenCalledTimes(2);
    expect(mockEventEmitter.emit).toHaveBeenCalledWith(
      EventActionEnum.FORUM_MESSAGE_CREATED,
      new ForumMessageCreatedEvent(Random.id, Random.id),
    );
    expect(mockEventEmitter.emit).toHaveBeenCalledWith(
      EventActionEnum.CREATE_ENTITY,
      new CreateEntityEvent('сообщение на форуме', Random.id, Random.id, 'Форум'),
    );
    expect(mockForumMessageRepository.save).toHaveBeenCalledTimes(1);
    expect(mockForumMessageRepository.save).toHaveBeenCalledWith(mockForumMessageInstance);
  });
});

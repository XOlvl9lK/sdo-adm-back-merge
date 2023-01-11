import { forumRepositoryMockProvider, TestHelper } from '@core/test/test.helper';
import { CreateForumService } from '@modules/forum/application/create-forum.service';
import { ForumEntity } from '@modules/forum/domain/forum.entity';
import { mockForumInstance } from '@modules/forum/domain/forum.entity.spec';
import { Random } from '@core/test/random';
import { CreateEntityEvent } from '@modules/event/infrastructure/events/create-entity.event';
import { EventActionEnum } from '@modules/event/application/create-event.service';
jest.mock('@modules/forum/domain/forum.entity');
//@ts-ignore
ForumEntity.mockImplementation(() => mockForumInstance);

const helpers = new TestHelper(forumRepositoryMockProvider);

describe('CreateForumService', () => {
  let createForumService: CreateForumService;

  beforeAll(async () => {
    [createForumService] = await helpers.beforeAll([CreateForumService]);
  });

  test('Should create forum and emit', async () => {
    await createForumService.create(
      {
        title: Random.lorem,
        description: Random.lorem,
      },
      Random.id,
    );

    const mockForumRepository = helpers.getProviderValueByToken('ForumRepository');
    const mockEventEmitter = helpers.getProviderValueByToken('EventEmitter2');

    expect(mockEventEmitter.emit).toHaveBeenCalledTimes(1);
    expect(mockEventEmitter.emit).toHaveBeenCalledWith(
      EventActionEnum.CREATE_ENTITY,
      new CreateEntityEvent('форум', Random.id, Random.id, 'Форум'),
    );
    expect(mockForumRepository.save).toHaveBeenCalledTimes(1);
    expect(mockForumRepository.save).toHaveBeenCalledWith(mockForumInstance);
  });
});

import { forumRepositoryMockProvider, TestHelper } from '@core/test/test.helper';
import { UpdateForumService } from '@modules/forum/application/update-forum.service';
import { Random } from '@core/test/random';
import { mockForumInstance } from '@modules/forum/domain/forum.entity.spec';
import { EventActionEnum } from '@modules/event/application/create-event.service';
import { UpdateEntityEvent } from '@modules/event/infrastructure/events/update-entity.event';
import { SingleSortActionTypesEnum } from '@modules/test/controllers/dtos/update-test-theme.dto';
import { ChangeOrderEvent } from '@modules/event/infrastructure/events/change-order.event';

const helpers = new TestHelper(forumRepositoryMockProvider);

describe('UpdateForumService', () => {
  let updateForumService: UpdateForumService;

  beforeAll(async () => {
    [updateForumService] = await helpers.beforeAll([UpdateForumService]);
  });

  test('Should update forum and emit', async () => {
    await updateForumService.update(
      {
        id: Random.id,
        title: Random.lorem,
        description: Random.lorem,
      },
      Random.id,
    );

    const mockForumRepository = helpers.getProviderValueByToken('ForumRepository');
    const mockEventEmitter = helpers.getProviderValueByToken('EventEmitter2');

    expect(mockForumRepository.save).toHaveBeenCalledTimes(1);
    expect(mockForumRepository.save).toHaveBeenCalledWith(mockForumInstance);
    expect(mockEventEmitter.emit).toHaveBeenCalledTimes(1);
    expect(mockEventEmitter.emit).toHaveBeenCalledWith(
      EventActionEnum.UPDATE_ENTITY,
      new UpdateEntityEvent('форум', Random.id, 'Форум', mockForumInstance),
    );
  });

  test('Should change forum order and emit', async () => {
    // await updateForumService.changeOrder(
    //   {
    //     sortActionType: SingleSortActionTypesEnum.DOWN,
    //     forumId: Random.id
    //   },
    //   Random.id
    // )
    //
    // const mockEventEmitter = helpers.getProviderValueByToken('EventEmitter2')
    // const mockForumRepository = helpers.getProviderValueByToken('ForumRepository')
    //
    // expect(mockEventEmitter.emit).toHaveBeenCalledTimes(1)
    // expect(mockEventEmitter.emit).toHaveBeenCalledWith(EventActionEnum.CHANGE_ORDER, new ChangeOrderEvent(Random.id, Random.id, 'форум', 'Форум'))
    // expect(mockForumRepository.save).toHaveBeenCalledTimes(1)
  });
});

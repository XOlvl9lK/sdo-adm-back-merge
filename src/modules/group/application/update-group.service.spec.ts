import {
  groupRepositoryMockProvider,
  TestHelper,
  userInGroupRepositoryMockProvider,
  userRepositoryMockProvider,
} from '@core/test/test.helper';
import { UpdateGroupService } from '@modules/group/application/update-group.service';
import { Random } from '@core/test/random';
import { mockGroupInstance, mockUserInGroupInstance } from '@modules/group/domain/group.entity.spec';
import clearAllMocks = jest.clearAllMocks;
import { EventActionEnum } from '@modules/event/application/create-event.service';
import { UpdateEntityEvent } from '@modules/event/infrastructure/events/update-entity.event';

const helpers = new TestHelper(
  groupRepositoryMockProvider,
  userRepositoryMockProvider,
  userInGroupRepositoryMockProvider,
);

describe('UpdateGroupService', () => {
  let updateGroupService: UpdateGroupService;

  beforeAll(async () => {
    [updateGroupService] = await helpers.beforeAll([UpdateGroupService]);
  });

  test('Should add users', async () => {
    await updateGroupService.addUsers({
      groupId: Random.id,
      userIds: [Random.id],
    });

    const mockGroupRepository = helpers.getProviderValueByToken('GroupRepository');

    expect(mockGroupRepository.save).toHaveBeenCalledTimes(1);
    expect(mockGroupRepository.save).toHaveBeenCalledWith(mockGroupInstance);
  });

  test('Should remove users', async () => {
    await updateGroupService.removeUsers({
      userIds: [Random.id],
      groupId: Random.id,
    });

    const mockGroupRepository = helpers.getProviderValueByToken('GroupRepository');
    const mockUserInGroupRepository = helpers.getProviderValueByToken('UserInGroupRepository');

    expect(mockUserInGroupRepository.remove).toHaveBeenCalledTimes(1);
    expect(mockUserInGroupRepository.remove).toHaveBeenCalledWith([mockUserInGroupInstance]);
    expect(mockGroupRepository.save).toHaveBeenCalledTimes(1);
    expect(mockGroupRepository.save).toHaveBeenCalledWith(mockGroupInstance);
  });

  test('Should move users', async () => {
    const addSpy = jest.spyOn(updateGroupService, 'addUsers');
    const removeSpy = jest.spyOn(updateGroupService, 'removeUsers');

    await updateGroupService.moveUsers({
      groupIdTo: Random.id,
      userIds: [Random.id],
      groupIdFrom: Random.id,
    });

    expect(addSpy).toHaveBeenCalledTimes(1);
    expect(addSpy).toHaveBeenCalledWith({
      groupId: Random.id,
      userIds: [Random.id],
    });
    expect(removeSpy).toHaveBeenCalledTimes(1);
    expect(removeSpy).toHaveBeenCalledWith({
      groupId: Random.id,
      userIds: [Random.id],
    });
  });

  test('Should update group and emit', async () => {
    await updateGroupService.update(
      {
        groupId: Random.id,
        title: Random.lorem,
        description: Random.lorem,
      },
      Random.id,
    );

    const mockGroupRepository = helpers.getProviderValueByToken('GroupRepository');
    const mocKEventEmitter = helpers.getProviderValueByToken('EventEmitter2');

    expect(mocKEventEmitter.emit).toHaveBeenCalledTimes(1);
    expect(mocKEventEmitter.emit).toHaveBeenCalledWith(
      EventActionEnum.UPDATE_ENTITY,
      new UpdateEntityEvent('группу', Random.id, 'Группы', mockGroupInstance),
    );
    expect(mockGroupRepository.save).toHaveBeenCalledTimes(1);
    expect(mockGroupRepository.save).toHaveBeenCalledWith(mockGroupInstance);
  });

  afterEach(() => {
    clearAllMocks();
  });
});

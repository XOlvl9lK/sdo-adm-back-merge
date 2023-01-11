import { groupRepositoryMockProvider, TestHelper } from '@core/test/test.helper';
import { CreateGroupService } from '@modules/group/application/create-group.service';
import { Random } from '@core/test/random';
import { GroupEntity } from '@modules/group/domain/group.entity';
import { mockGroupInstance } from '@modules/group/domain/group.entity.spec';
import { CreateEntityEvent } from '@modules/event/infrastructure/events/create-entity.event';
import { EventActionEnum } from '@modules/event/application/create-event.service';
jest.mock('@modules/group/domain/group.entity');
//@ts-ignore
GroupEntity.mockImplementation(() => mockGroupInstance);

const helpers = new TestHelper(groupRepositoryMockProvider);

describe('CreateGroupService', () => {
  let createGroupService: CreateGroupService;

  beforeAll(async () => {
    [createGroupService] = await helpers.beforeAll([CreateGroupService]);
  });

  test('Should create group and emit', async () => {
    await createGroupService.create(
      {
        title: Random.lorem,
        description: Random.lorem,
      },
      Random.id,
    );

    const mockGroupRepository = helpers.getProviderValueByToken('GroupRepository');
    const mockEventEmitter = helpers.getProviderValueByToken('EventEmitter2');

    expect(mockEventEmitter.emit).toHaveBeenCalledTimes(1);
    expect(mockEventEmitter.emit).toHaveBeenCalledWith(
      EventActionEnum.CREATE_ENTITY,
      new CreateEntityEvent('группу', Random.id, Random.id, 'Группы'),
    );
    expect(mockGroupRepository.save).toHaveBeenCalledTimes(1);
    expect(mockGroupRepository.save).toHaveBeenCalledWith(mockGroupInstance);
  });
});

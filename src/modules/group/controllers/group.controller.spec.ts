import { TestHelper } from '@core/test/test.helper';
import { CreateGroupService } from '@modules/group/application/create-group.service';
import { UpdateGroupService } from '@modules/group/application/update-group.service';
import { FindGroupService } from '@modules/group/application/find-group.service';
import { mockGroupInstance, mockUserInGroupInstance } from '@modules/group/domain/group.entity.spec';
import { Random } from '@core/test/random';
import { GroupController } from '@modules/group/controllers/group.controller';
import clearAllMocks = jest.clearAllMocks;

const helpers = new TestHelper(
  { type: 'createService', provide: CreateGroupService },
  {
    type: 'updateService',
    provide: UpdateGroupService,
    extend: [
      { method: 'addUsers', mockImplementation: jest.fn() },
      { method: 'removeUsers', mockImplementation: jest.fn() },
      { method: 'moveUsers', mockImplementation: jest.fn() },
    ],
  },
  {
    type: 'findService',
    provide: FindGroupService,
    mockValue: mockGroupInstance,
    extend: [
      {
        method: 'findById',
        mockImplementation: jest.fn().mockResolvedValue({
          total: Random.number,
          data: {
            ...mockGroupInstance,
            users: [mockUserInGroupInstance],
          },
        }),
      },
      {
        method: 'findByIdWithoutPagination',
        mockImplementation: jest.fn().mockResolvedValue(mockGroupInstance),
      },
    ],
  },
);

describe('GroupController', () => {
  let groupController: GroupController;

  beforeAll(async () => {
    [groupController] = await helpers.beforeAll([GroupController], [], [GroupController]);
  });

  test('Should return all groups and count', async () => {
    const result = await groupController.getAll({});

    expect(result).toEqual({
      total: Random.number,
      data: [mockGroupInstance],
    });
  });

  test('Should return group by id and count', async () => {
    const result = await groupController.getById(Random.id, {});

    expect(result).toEqual({
      total: Random.number,
      data: {
        ...mockGroupInstance,
        users: [mockUserInGroupInstance],
      },
    });
  });

  test('Should return group by id without pagination', async () => {
    const result = await groupController.getByIdWithoutPagination(Random.id);

    expect(result).toEqual(mockGroupInstance);
  });

  test('Should call create', async () => {
    await groupController.create(
      {
        description: Random.lorem,
        title: Random.lorem,
      },
      Random.id,
    );

    const mockCreateGroupService = helpers.getProviderValueByToken('CreateGroupService');

    expect(mockCreateGroupService.create).toHaveBeenCalledTimes(1);
    expect(mockCreateGroupService.create).toHaveBeenCalledWith(
      {
        description: Random.lorem,
        title: Random.lorem,
      },
      Random.id,
    );
  });

  test('Should call update', async () => {
    await groupController.update(
      {
        title: Random.lorem,
        description: Random.lorem,
        groupId: Random.id,
      },
      Random.id,
    );

    const mockUpdateGroupService = helpers.getProviderValueByToken('UpdateGroupService');

    expect(mockUpdateGroupService.update).toHaveBeenCalledTimes(1);
    expect(mockUpdateGroupService.update).toHaveBeenCalledWith(
      {
        title: Random.lorem,
        description: Random.lorem,
        groupId: Random.id,
      },
      Random.id,
    );
  });

  test('Should call addUsers', async () => {
    await groupController.addUsers({
      groupId: Random.id,
      userIds: Random.ids,
    });

    const mockUpdateGroupService = helpers.getProviderValueByToken('UpdateGroupService');

    expect(mockUpdateGroupService.addUsers).toHaveBeenCalledTimes(1);
    expect(mockUpdateGroupService.addUsers).toHaveBeenCalledWith({
      groupId: Random.id,
      userIds: Random.ids,
    });
  });

  test('Should call removeUsers', async () => {
    await groupController.removeUsers({
      groupId: Random.id,
      userIds: Random.ids,
    });

    const mockUpdateGroupService = helpers.getProviderValueByToken('UpdateGroupService');

    expect(mockUpdateGroupService.removeUsers).toHaveBeenCalledTimes(1);
    expect(mockUpdateGroupService.removeUsers).toHaveBeenCalledWith({
      groupId: Random.id,
      userIds: Random.ids,
    });
  });

  test('Should call moveUsers', async () => {
    await groupController.moveUsers({
      userIds: Random.ids,
      groupIdFrom: Random.id,
      groupIdTo: Random.id,
    });

    const mockUpdateGroupService = helpers.getProviderValueByToken('UpdateGroupService');

    expect(mockUpdateGroupService.moveUsers).toHaveBeenCalledTimes(1);
    expect(mockUpdateGroupService.moveUsers).toHaveBeenCalledWith({
      userIds: Random.ids,
      groupIdFrom: Random.id,
      groupIdTo: Random.id,
    });
  });

  afterEach(() => {
    clearAllMocks();
  });
});

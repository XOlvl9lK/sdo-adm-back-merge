import { TestHelper } from '@core/test/test.helper';
import { FindForumService } from '@modules/forum/application/find-forum.service';
import { mockForumInstance } from '@modules/forum/domain/forum.entity.spec';
import { CreateForumService } from '@modules/forum/application/create-forum.service';
import { DeleteForumService } from '@modules/forum/application/delete-forum.service';
import { UpdateForumService } from '@modules/forum/application/update-forum.service';
import { ForumController } from '@modules/forum/controllers/forum.controller';
import { Random } from '@core/test/random';
import { SingleSortActionTypesEnum } from '@modules/test/controllers/dtos/update-test-theme.dto';

const helpers = new TestHelper(
  {
    type: 'findService',
    provide: FindForumService,
    mockValue: mockForumInstance,
    extend: [
      {
        method: 'findAll',
        mockImplementation: jest.fn().mockResolvedValue([mockForumInstance]),
      },
    ],
  },
  { type: 'createService', provide: CreateForumService },
  { type: 'deleteService', provide: DeleteForumService },
  {
    type: 'updateService',
    provide: UpdateForumService,
    extend: [{ method: 'changeOrder', mockImplementation: jest.fn() }],
  },
);

describe('ForumController', () => {
  let forumController: ForumController;

  beforeAll(async () => {
    [forumController] = await helpers.beforeAll([ForumController], [], [ForumController]);
  });

  test('Should return all forums', async () => {
    const result = await forumController.getAll();

    expect(result).toEqual([mockForumInstance]);
  });

  test('Should return forum by id', async () => {
    const result = await forumController.getById(Random.id);

    expect(result).toEqual(mockForumInstance);
  });

  test('Should call create', async () => {
    await forumController.create(
      {
        description: Random.lorem,
        title: Random.lorem,
      },
      Random.id,
    );

    const mockCreateForumService = helpers.getProviderValueByToken('CreateForumService');

    expect(mockCreateForumService.create).toHaveBeenCalledTimes(1);
    expect(mockCreateForumService.create).toHaveBeenCalledWith(
      {
        description: Random.lorem,
        title: Random.lorem,
      },
      Random.id,
    );
  });

  test('Should call update', async () => {
    await forumController.update(
      {
        id: Random.id,
        title: Random.lorem,
        description: Random.lorem,
      },
      Random.id,
    );

    const mockUpdateForumService = helpers.getProviderValueByToken('UpdateForumService');

    expect(mockUpdateForumService.update).toHaveBeenCalledTimes(1);
    expect(mockUpdateForumService.update).toHaveBeenCalledWith(
      {
        id: Random.id,
        title: Random.lorem,
        description: Random.lorem,
      },
      Random.id,
    );
  });

  test('Should call changeOrder', async () => {
    await forumController.changeOrder(
      {
        forumId: Random.id,
        sortActionType: SingleSortActionTypesEnum.DOWN,
      },
      Random.id,
    );

    const mockUpdateForumService = helpers.getProviderValueByToken('UpdateForumService');

    expect(mockUpdateForumService.changeOrder).toHaveBeenCalledTimes(1);
    expect(mockUpdateForumService.changeOrder).toHaveBeenCalledWith(
      {
        forumId: Random.id,
        sortActionType: SingleSortActionTypesEnum.DOWN,
      },
      Random.id,
    );
  });

  test('Should call delete', async () => {
    await forumController.delete(Random.id);

    const mockDeleteForumService = helpers.getProviderValueByToken('DeleteForumService');

    expect(mockDeleteForumService.delete).toHaveBeenCalledTimes(1);
    expect(mockDeleteForumService.delete).toHaveBeenCalledWith(Random.id);
  });
});

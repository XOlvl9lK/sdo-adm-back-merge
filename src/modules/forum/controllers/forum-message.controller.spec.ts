import { TestHelper } from '@core/test/test.helper';
import { CreateForumMessageService } from '@modules/forum/application/create-forum-message.service';
import { DeleteForumMessageService } from '@modules/forum/application/delete-forum-message.service';
import { FindForumMessageService } from '@modules/forum/application/find-forum-message.service';
import { mockForumMessageInstance } from '@modules/forum/domain/forum-message.entity.spec';
import { UpdateForumMessageService } from '@modules/forum/application/update-forum-message.service';
import { ForumMessageController } from '@modules/forum/controllers/forum-message.controller';
import { Random } from '@core/test/random';
import { mockThemeInstance } from '@modules/forum/domain/theme.entity.spec';
import clearAllMocks = jest.clearAllMocks;

const helpers = new TestHelper(
  { type: 'createService', provide: CreateForumMessageService },
  { type: 'deleteService', provide: DeleteForumMessageService },
  {
    type: 'findService',
    provide: FindForumMessageService,
    mockValue: mockForumMessageInstance,
    extend: [
      {
        method: 'findByThemeId',
        mockImplementation: jest.fn().mockResolvedValue({
          total: Random.number,
          data: {
            theme: mockThemeInstance,
            forumMessages: [mockForumMessageInstance],
          },
        }),
      },
    ],
  },
  {
    type: 'updateService',
    provide: UpdateForumMessageService,
    extend: [{ method: 'moveForumMessage', mockImplementation: jest.fn() }],
  },
);

describe('ForumMessageController', () => {
  let forumMessageController: ForumMessageController;

  beforeAll(async () => {
    [forumMessageController] = await helpers.beforeAll([ForumMessageController], [], [ForumMessageController]);
  });

  test('Should return forum message by id', async () => {
    const result = await forumMessageController.getById(Random.id);

    expect(result).toEqual(mockForumMessageInstance);
  });

  test('Should return forum messages by themeId and count', async () => {
    const result = await forumMessageController.getByThemeId(Random.id, {});

    expect(result).toEqual({
      total: Random.number,
      data: {
        theme: mockThemeInstance,
        forumMessages: [mockForumMessageInstance],
      },
    });
  });

  test('Should call create', async () => {
    await forumMessageController.create(
      {
        message: Random.lorem,
        themeId: Random.id,
        authorId: Random.id,
      },
      Random.id,
    );

    const mockCreateForumMessageService = helpers.getProviderValueByToken('CreateForumMessageService');

    expect(mockCreateForumMessageService.create).toHaveBeenCalledTimes(1);
    expect(mockCreateForumMessageService.create).toHaveBeenCalledWith(
      {
        message: Random.lorem,
        themeId: Random.id,
        authorId: Random.id,
      },
      Random.id,
    );
  });

  test('Should call update', async () => {
    await forumMessageController.update(
      {
        id: Random.id,
        content: Random.lorem,
      },
      Random.id,
    );

    const mockUpdateForumMessageService = helpers.getProviderValueByToken('UpdateForumMessageService');

    expect(mockUpdateForumMessageService.update).toHaveBeenCalledTimes(1);
    expect(mockUpdateForumMessageService.update).toHaveBeenCalledWith(
      {
        id: Random.id,
        content: Random.lorem,
      },
      Random.id,
    );
  });

  test('Should call moveForumMessage', async () => {
    await forumMessageController.moveForumMessage({
      id: Random.id,
      setFirst: false,
      themeIdTo: Random.id,
    });

    const mockUpdateForumMessageService = helpers.getProviderValueByToken('UpdateForumMessageService');

    expect(mockUpdateForumMessageService.moveForumMessage).toHaveBeenCalledTimes(1);
    expect(mockUpdateForumMessageService.moveForumMessage).toHaveBeenCalledWith({
      id: Random.id,
      setFirst: false,
      themeIdTo: Random.id,
    });
  });

  test('Should call delete', async () => {
    await forumMessageController.delete(Random.id);

    const mockDeleteForumMessageService = helpers.getProviderValueByToken('DeleteForumMessageService');

    expect(mockDeleteForumMessageService.delete).toHaveBeenCalledTimes(1);
    expect(mockDeleteForumMessageService.delete).toHaveBeenCalledWith(Random.id);
  });

  afterEach(() => {
    clearAllMocks();
  });
});

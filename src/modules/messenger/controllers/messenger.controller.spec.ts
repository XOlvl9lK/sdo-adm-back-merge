import { TestHelper } from '@core/test/test.helper';
import { CreateMessageService } from '@modules/messenger/application/create-message.service';
import { DeleteMessageService } from '@modules/messenger/application/delete-message.service';
import { FindMessageService } from '@modules/messenger/application/find-message.service';
import { mockMessageInstance } from '@modules/messenger/domain/message.entity.spec';
import { Random } from '@core/test/random';
import { UpdateMessageService } from '@modules/messenger/application/update-message.service';
import { MessengerController } from '@modules/messenger/controllers/messenger.controller';
import clearAllMocks = jest.clearAllMocks;

const helpers = new TestHelper(
  {
    type: 'createService',
    provide: CreateMessageService,
    extend: [
      { method: 'sendMessage', mockImplementation: jest.fn() },
      { method: 'createDraftMessage', mockImplementation: jest.fn() },
    ],
  },
  {
    type: 'deleteService',
    provide: DeleteMessageService,
  },
  {
    type: 'findService',
    provide: FindMessageService,
    mockValue: mockMessageInstance,
    extend: [
      {
        method: 'countAllMessagesByUser',
        mockImplementation: jest.fn().mockResolvedValue({
          incoming: Random.number,
          unread: Random.number,
          outgoing: Random.number,
          draft: Random.number,
          basket: Random.number,
        }),
      },
      {
        method: 'findIncomingByUser',
        mockImplementation: jest.fn().mockResolvedValue([[mockMessageInstance], Random.number]),
      },
      {
        method: 'findOutgoingByUser',
        mockImplementation: jest.fn().mockResolvedValue([[mockMessageInstance], Random.number]),
      },
      {
        method: 'findDraftByUser',
        mockImplementation: jest.fn().mockResolvedValue([[mockMessageInstance], Random.number]),
      },
      {
        method: 'findBasketByUser',
        mockImplementation: jest.fn().mockResolvedValue([[mockMessageInstance], Random.number]),
      },
      {
        method: 'findNewMessage',
        mockImplementation: jest.fn().mockResolvedValue(mockMessageInstance),
      },
    ],
  },
  {
    type: 'updateService',
    provide: UpdateMessageService,
    extend: [{ method: 'moveToBasket', mockImplementation: jest.fn() }],
  },
);

describe('MessengerController', () => {
  let messengerController: MessengerController;

  beforeAll(async () => {
    [messengerController] = await helpers.beforeAll([MessengerController], [], [MessengerController]);
  });

  test('Should return count all messages by user', async () => {
    const result = await messengerController.countByUser(Random.id);

    expect(result).toEqual({
      incoming: Random.number,
      unread: Random.number,
      outgoing: Random.number,
      draft: Random.number,
      basket: Random.number,
    });
  });

  test('Should return incoming messages by user and count', async () => {
    const result = await messengerController.getIncomingByUser({}, Random.id);

    expect(result).toEqual({
      data: [mockMessageInstance],
      total: Random.number,
    });
  });

  test('Should return outgoing messages by user and count', async () => {
    const result = await messengerController.getOutgoingByUser({}, Random.id);

    expect(result).toEqual({
      data: [mockMessageInstance],
      total: Random.number,
    });
  });

  test('Should return draft messages by user and count', async () => {
    const result = await messengerController.getDraftByUser({}, Random.id);

    expect(result).toEqual({
      data: [mockMessageInstance],
      total: Random.number,
    });
  });

  test('Should return basket messages by user and count', async () => {
    const result = await messengerController.getBasketByUser({}, Random.id);

    expect(result).toEqual({
      data: [mockMessageInstance],
      total: Random.number,
    });
  });

  test('Should return new incoming message', async () => {
    const result = await messengerController.getNewMessage(Random.id);

    expect(result).toEqual(mockMessageInstance);
  });

  test('Should return message by id', async () => {
    const result = await messengerController.getById(Random.id, Random.id);

    expect(result).toEqual(mockMessageInstance);
  });

  test('Should call sendMessage', async () => {
    await messengerController.sendMessage({
      receiverId: Random.id,
      senderId: Random.id,
      messageId: Random.id,
      content: Random.lorem,
      theme: Random.lorem,
    });

    const mockCreateMessageService = helpers.getProviderValueByToken('CreateMessageService');

    expect(mockCreateMessageService.sendMessage).toHaveBeenCalledTimes(1);
    expect(mockCreateMessageService.sendMessage).toHaveBeenCalledWith({
      receiverId: Random.id,
      senderId: Random.id,
      messageId: Random.id,
      content: Random.lorem,
      theme: Random.lorem,
    });
  });

  test('Should call createDraftMessage', async () => {
    await messengerController.createDraftMessage({
      receiverId: Random.id,
      senderId: Random.id,
      messageId: Random.id,
      content: Random.lorem,
      theme: Random.lorem,
    });

    const mockCreateMessageService = helpers.getProviderValueByToken('CreateMessageService');

    expect(mockCreateMessageService.createDraftMessage).toHaveBeenCalledTimes(1);
    expect(mockCreateMessageService.createDraftMessage).toHaveBeenCalledWith({
      receiverId: Random.id,
      senderId: Random.id,
      messageId: Random.id,
      content: Random.lorem,
      theme: Random.lorem,
    });
  });

  test('Should call moveToBasket', async () => {
    await messengerController.moveToBasket({
      messageIds: Random.ids,
      userId: Random.id,
    });

    const mockUpdateMessageService = helpers.getProviderValueByToken('UpdateMessageService');

    expect(mockUpdateMessageService.moveToBasket).toHaveBeenCalledTimes(1);
    expect(mockUpdateMessageService.moveToBasket).toHaveBeenCalledWith({
      messageIds: Random.ids,
      userId: Random.id,
    });
  });

  test('Should call delete', async () => {
    await messengerController.delete(Random.ids);

    const mockDeleteMessageService = helpers.getProviderValueByToken('DeleteMessageService');

    expect(mockDeleteMessageService.delete).toHaveBeenCalledTimes(1);
    expect(mockDeleteMessageService.delete).toHaveBeenCalledWith(Random.ids);
  });

  afterEach(() => {
    clearAllMocks();
  });
});

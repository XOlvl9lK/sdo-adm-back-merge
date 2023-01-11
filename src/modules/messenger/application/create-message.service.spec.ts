import { messageRepositoryMockProvider, TestHelper, userRepositoryMockProvider } from '@core/test/test.helper';
import { DeleteMessageService } from '@modules/messenger/application/delete-message.service';
import { CreateMessageService } from '@modules/messenger/application/create-message.service';
import { Random } from '@core/test/random';
import { MessageEntity, MessageTypeEnum } from '@modules/messenger/domain/message.entity';
import { mockDraftMessageInstance, mockMessageInstance } from '@modules/messenger/domain/message.entity.spec';
import clearAllMocks = jest.clearAllMocks;
import { plainToInstance } from 'class-transformer';
jest.mock('@modules/messenger/domain/message.entity');
//@ts-ignore
MessageEntity.createIncomingMessage.mockImplementation(() => mockMessageInstance);
//@ts-ignore
MessageEntity.createOutgoingMessage.mockImplementation(() => mockMessageInstance);
//@ts-ignore
MessageEntity.createDraftMessage.mockImplementation(() => mockDraftMessageInstance);

const helpers = new TestHelper(messageRepositoryMockProvider, userRepositoryMockProvider, {
  type: 'deleteService',
  provide: DeleteMessageService,
});

describe('CreateMessageService', () => {
  let createMessageService: CreateMessageService;

  beforeAll(async () => {
    [createMessageService] = await helpers.beforeAll([CreateMessageService]);
  });

  test('Should send message and emit twice', async () => {
    await createMessageService.sendMessage({
      theme: Random.lorem,
      content: Random.lorem,
      receiverId: Random.id,
      senderId: Random.id,
      messageId: Random.id,
    });

    const mockMessageRepository = helpers.getProviderValueByToken('MessageRepository');
    const mockEventEmitter = helpers.getProviderValueByToken('EventEmitter2');

    expect(mockEventEmitter.emit).toHaveBeenCalledTimes(2);
    expect(mockMessageRepository.save).toHaveBeenCalledTimes(2);
    expect(mockMessageRepository.save).toHaveBeenCalledWith(mockMessageInstance);
    expect(mockMessageRepository.save).toHaveBeenCalledWith(mockMessageInstance);
  });

  test('Should create draft message', async () => {
    await createMessageService.createDraftMessage({
      theme: Random.lorem,
      content: Random.lorem,
      messageId: Random.id,
      senderId: Random.id,
      receiverId: Random.id,
    });

    const mockMessageRepository = helpers.getProviderValueByToken('MessageRepository');

    expect(mockMessageRepository.save).toHaveBeenCalledTimes(1);
    expect(mockMessageRepository.save).toHaveBeenCalledWith(mockDraftMessageInstance);
  });

  afterEach(() => {
    clearAllMocks();
  });
});

import { messageRepositoryMockProvider, TestHelper } from '@core/test/test.helper';
import { MessageReadEventHandler } from '@modules/messenger/application/message-read.event-handler';
import { mockMessageInstance } from '@modules/messenger/domain/message.entity.spec';
import { Random } from '@core/test/random';
import { EventActionEnum } from '@modules/event/application/create-event.service';

const helpers = new TestHelper(messageRepositoryMockProvider);

describe('MessageReadEventHandler', () => {
  let messageReadEventHandler: MessageReadEventHandler;

  beforeAll(async () => {
    [messageReadEventHandler] = await helpers.beforeAll([MessageReadEventHandler]);
  });

  test('Should save read message and emit', async () => {
    await messageReadEventHandler.handleMessageRead({
      message: mockMessageInstance,
      userId: Random.id,
    });

    const mockMessageRepository = helpers.getProviderValueByToken('MessageRepository');
    const mockEventEmitter = helpers.getProviderValueByToken('EventEmitter2');

    expect(mockEventEmitter.emit).toHaveBeenCalledTimes(1);
    expect(mockEventEmitter.emit).toHaveBeenCalledWith(
      EventActionEnum.SEND_MESSAGE + '_' + Random.id,
      mockMessageInstance,
    );
    expect(mockMessageRepository.save).toHaveBeenCalledTimes(1);
    expect(mockMessageRepository.save).toHaveBeenCalledWith(mockMessageInstance);
  });
});

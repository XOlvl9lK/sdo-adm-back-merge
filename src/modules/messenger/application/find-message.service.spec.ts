import { messageRepositoryMockProvider, TestHelper } from '@core/test/test.helper';
import { FindMessageService } from '@modules/messenger/application/find-message.service';
import { Random } from '@core/test/random';
import { EventActionEnum } from '@modules/event/application/create-event.service';
import { MessageReadEvent } from '@modules/event/infrastructure/events/message-read.event';
import { mockMessageInstance } from '@modules/messenger/domain/message.entity.spec';

const helpers = new TestHelper(messageRepositoryMockProvider);

describe('FindMessageService', () => {
  let findMessageService: FindMessageService;

  beforeAll(async () => {
    [findMessageService] = await helpers.beforeAll([FindMessageService]);
  });

  test('Should return count all messages by user', async () => {
    const result = await findMessageService.countAllMessagesByUser(Random.id);

    expect(result).toEqual({
      incoming: Random.number,
      unread: Random.number,
      outgoing: Random.number,
      draft: Random.number,
      basket: Random.number,
    });
  });

  test('Should return message by id and emit', async () => {
    const result = await findMessageService.findById(Random.id, Random.id);

    const mockEventEmitter = helpers.getProviderValueByToken('EventEmitter2');

    expect(mockEventEmitter.emit).toHaveBeenCalledTimes(1);
    expect(mockEventEmitter.emit).toHaveBeenCalledWith(
      EventActionEnum.MESSAGE_READ,
      new MessageReadEvent(Random.id, mockMessageInstance),
    );
    expect(result).toEqual(mockMessageInstance);
  });

  test('Should return incoming messages and count', async () => {
    const result = await findMessageService.findIncomingByUser({}, Random.id);

    expect(result).toEqual([[mockMessageInstance], Random.number]);
  });

  test('Should return outgoing messages and count', async () => {
    const result = await findMessageService.findOutgoingByUser({}, Random.id);

    expect(result).toEqual([[mockMessageInstance], Random.number]);
  });

  test('Should return draft messages and count', async () => {
    const result = await findMessageService.findDraftByUser({}, Random.id);

    expect(result).toEqual([[mockMessageInstance], Random.number]);
  });

  test('Should return basket messages and count', async () => {
    const result = await findMessageService.findBasketByUser({}, Random.id);

    expect(result).toEqual([[mockMessageInstance], Random.number]);
  });

  test('Should return new incoming message', async () => {
    const result = await findMessageService.findNewMessage(Random.id);

    expect(result).toEqual(mockMessageInstance);
  });
});

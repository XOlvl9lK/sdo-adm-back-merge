import { messageRepositoryMockProvider, TestHelper, userRepositoryMockProvider } from '@core/test/test.helper';
import { UpdateMessageService } from '@modules/messenger/application/update-message.service';
import { Random } from '@core/test/random';
import { mockMessageInstance } from '@modules/messenger/domain/message.entity.spec';

const helpers = new TestHelper(messageRepositoryMockProvider, userRepositoryMockProvider);

describe('UpdateMessageService', () => {
  let updateMessageService: UpdateMessageService;

  beforeAll(async () => {
    [updateMessageService] = await helpers.beforeAll([UpdateMessageService]);
  });

  test('Should move message to basket', async () => {
    await updateMessageService.moveToBasket({
      messageIds: Random.ids,
      userId: Random.id,
    });

    const mockMessageRepository = helpers.getProviderValueByToken('MessageRepository');

    expect(mockMessageRepository.save).toHaveBeenCalledTimes(1);
    expect(mockMessageRepository.save).toHaveBeenCalledWith([mockMessageInstance]);
  });
});

import { messageRepositoryMockProvider, TestHelper } from '@core/test/test.helper';
import { DeleteMessageService } from '@modules/messenger/application/delete-message.service';
import { Random } from '@core/test/random';
import { mockMessageInstance } from '@modules/messenger/domain/message.entity.spec';

const helpers = new TestHelper(messageRepositoryMockProvider);

describe('DeleteMessageService', () => {
  let deleteMessageService: DeleteMessageService;

  beforeAll(async () => {
    [deleteMessageService] = await helpers.beforeAll([DeleteMessageService]);
  });

  test('Should delete message', async () => {
    await deleteMessageService.delete(Random.ids);

    const mockMessageRepository = helpers.getProviderValueByToken('MessageRepository');

    expect(mockMessageRepository.remove).toHaveBeenCalledTimes(1);
    expect(mockMessageRepository.remove).toHaveBeenCalledWith([mockMessageInstance]);
  });
});

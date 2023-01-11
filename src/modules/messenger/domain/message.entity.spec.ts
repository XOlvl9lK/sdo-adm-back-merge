import { mockBaseEntity } from '@core/domain/base.entity.mock';
import { Random } from '@core/test/random';
import { mockUserInstance } from '@modules/user/domain/user.entity.spec';
import { MessageEntity, MessageStatusEnum, MessageTypeEnum } from '@modules/messenger/domain/message.entity';
import { plainToInstance } from 'class-transformer';

const mockMessage = {
  ...mockBaseEntity,
  theme: Random.lorem,
  content: Random.lorem,
  receiver: mockUserInstance,
  sender: mockUserInstance,
  basketOwner: mockUserInstance,
  status: MessageStatusEnum.UNREAD,
  type: MessageTypeEnum.INCOMING,
};

export const mockMessageInstance = plainToInstance(MessageEntity, mockMessage);

const mockDraftMessage = {
  ...mockMessage,
  type: MessageTypeEnum.DRAFT,
};

export const mockDraftMessageInstance = plainToInstance(MessageEntity, mockDraftMessage);

describe('MessageEntity', () => {
  test('Should create incoming message', () => {});
});

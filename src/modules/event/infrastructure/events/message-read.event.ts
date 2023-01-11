import { MessageEntity } from '@modules/messenger/domain/message.entity';

export class MessageReadEvent {
  constructor(public userId: string, public message: MessageEntity) {}
}

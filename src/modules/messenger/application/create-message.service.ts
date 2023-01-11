import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageRepository } from '@modules/messenger/infrastructure/database/message.repository';
import { UserRepository } from '@modules/user/infrastructure/database/user.repository';
import { CreateMessageRequestDto } from '@modules/messenger/controllers/dtos/create-message.request-dto';
import { UserException } from '@modules/user/infrastructure/exceptions/user.exception';
import { MessageEntity } from '@modules/messenger/domain/message.entity';
import { DeleteMessageService } from '@modules/messenger/application/delete-message.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventActionEnum } from '@modules/event/application/create-event.service';
import { SendMessageEvent } from '@modules/event/infrastructure/events/send-message.event';

@Injectable()
export class CreateMessageService {
  constructor(
    @InjectRepository(MessageRepository)
    private messageRepository: MessageRepository,
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private deleteMessageService: DeleteMessageService,
    private eventEmitter: EventEmitter2,
  ) {}

  async sendMessage({ theme, content, senderId, receiverId, messageId }: CreateMessageRequestDto) {
    const [sender, receiver, draftMessage] = await Promise.all([
      this.userRepository.findById(senderId),
      this.userRepository.findById(receiverId),
      this.messageRepository.findOneDraftById(messageId),
    ]);
    if (!sender || !receiver) UserException.NotFound('Сообщения');
    if (draftMessage) await this.messageRepository.remove(draftMessage);
    const incomingMessage = MessageEntity.createIncomingMessage(theme, content, receiver, sender);
    const outgoingMessage = MessageEntity.createOutgoingMessage(theme, content, receiver, sender);
    await Promise.all([this.messageRepository.save(incomingMessage), this.messageRepository.save(outgoingMessage)]);
    this.eventEmitter.emit(EventActionEnum.SEND_MESSAGE, new SendMessageEvent(sender.id));
    this.eventEmitter.emit(EventActionEnum.SEND_MESSAGE + '_' + receiverId, incomingMessage);
    return outgoingMessage;
  }

  async createDraftMessage({ theme, content, senderId, receiverId }: CreateMessageRequestDto) {
    const [sender, receiver] = await Promise.all([
      this.userRepository.findById(senderId),
      this.userRepository.findById(receiverId),
    ]);
    if (!sender) UserException.NotFound('Сообщения');
    const draftMessage = MessageEntity.createDraftMessage(theme, content, sender, receiver);
    return await this.messageRepository.save(draftMessage);
  }
}

import { Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { EventActionEnum } from '@modules/event/application/create-event.service';
import { MessageReadEvent } from '@modules/event/infrastructure/events/message-read.event';
import { MessageRepository } from '@modules/messenger/infrastructure/database/message.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageStatusEnum } from '@modules/messenger/domain/message.entity';

@Injectable()
export class MessageReadEventHandler {
  constructor(
    @InjectRepository(MessageRepository)
    private messageRepository: MessageRepository,
    private eventEmitter: EventEmitter2,
  ) {}

  @OnEvent(EventActionEnum.MESSAGE_READ, { async: true })
  async handleMessageRead({ message, userId }: MessageReadEvent) {
    if (message.receiver.id === userId) {
      message.status = MessageStatusEnum.READ;
      await this.messageRepository.save(message);
      const newMessage = await this.messageRepository.findNewIncoming(userId);
      this.eventEmitter.emit(EventActionEnum.SEND_MESSAGE + '_' + userId, newMessage);
    }
  }
}

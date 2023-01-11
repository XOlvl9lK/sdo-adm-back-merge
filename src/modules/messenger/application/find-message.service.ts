import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageRepository } from '@modules/messenger/infrastructure/database/message.repository';
import { RequestQuery } from '@core/libs/types';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventActionEnum } from '@modules/event/application/create-event.service';
import { MessageReadEvent } from '@modules/event/infrastructure/events/message-read.event';
import { MessageException } from '@modules/messenger/infrastructure/exceptions/message.exception';

@Injectable()
export class FindMessageService {
  constructor(
    @InjectRepository(MessageRepository)
    private messageRepository: MessageRepository,
    private eventEmitter: EventEmitter2,
  ) {}

  async countAllMessagesByUser(userId: string) {
    const [incoming, unread, outgoing, draft, basket] = await Promise.all(
      this.messageRepository.countMessagesByUser(userId),
    );
    return {
      incoming,
      unread,
      outgoing,
      draft,
      basket,
    };
  }

  async findById(id: string, userId: string) {
    const message = await this.messageRepository.findById(id);
    if (!message.isUserOwnsMessage(userId))
      MessageException.UserNotOwnsMessage(
        'Сообщения',
        `Пользователь id=${userId}. Отсутствует доступ для просмотра сообщения id=${id}`,
      );
    this.eventEmitter.emit(EventActionEnum.MESSAGE_READ, new MessageReadEvent(userId, message));
    return message;
  }

  async findIncomingByUser(requestQuery: RequestQuery, userId: string) {
    return await this.messageRepository.findIncomingByUser(requestQuery, userId);
  }

  async findOutgoingByUser(requestQuery: RequestQuery, userId: string) {
    return await this.messageRepository.findOutgoingByUser(requestQuery, userId);
  }

  async findDraftByUser(requestQuery: RequestQuery, userId: string) {
    return await this.messageRepository.findDraftByUser(requestQuery, userId);
  }

  async findBasketByUser(requestQuery: RequestQuery, userId: string) {
    return await this.messageRepository.findBasketByUser(requestQuery, userId);
  }

  async findNewMessage(userId: string) {
    return await this.messageRepository.findNewIncoming(userId);
  }
}

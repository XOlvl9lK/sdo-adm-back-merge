import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageRepository } from '@modules/messenger/infrastructure/database/message.repository';
import { MessageException } from '@modules/messenger/infrastructure/exceptions/message.exception';
import { UserRepository } from '@modules/user/infrastructure/database/user.repository';
import { MoveToBasketRequestDto } from '@modules/messenger/controllers/dtos/move-to-basket.request-dto';
import { UserException } from '@modules/user/infrastructure/exceptions/user.exception';
import { UpdateDraftMessageDto } from '@modules/messenger/controllers/dtos/update-draft-message.dto';
import { EventActionEnum } from '@modules/event/application/create-event.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class UpdateMessageService {
  constructor(
    @InjectRepository(MessageRepository)
    private messageRepository: MessageRepository,
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private eventEmitter: EventEmitter2,
  ) {}

  async updateDraftMessage({ theme, content, id, receiverId }: UpdateDraftMessageDto) {
    const [draftMessage, receiver] = await Promise.all([
      this.messageRepository.findOneDraftById(id),
      this.userRepository.findById(receiverId),
    ]);
    if (!draftMessage) MessageException.NotFound();
    if (!receiverId) UserException.NotFound('Сообщения');
    draftMessage.updateDraft(theme, content, receiver);
    return await this.messageRepository.save(draftMessage);
  }

  async moveToBasket({ messageIds, userId }: MoveToBasketRequestDto) {
    const messages = await this.messageRepository.findByIds(messageIds);
    const user = await this.userRepository.findById(userId);
    if (!messages.length) MessageException.NotFound();
    if (!user) UserException.NotFound('Сообщения');
    messages.forEach(message => message.moveToBasket(user));
    await this.messageRepository.save(messages);
    this.eventEmitter.emit(EventActionEnum.SEND_MESSAGE + '_' + userId);
  }
}

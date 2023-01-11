import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ForumMessageRepository, ThemeRepository } from '@modules/forum/infrastructure/database/forum.repository';
import { MoveForumMessageDto, UpdateForumMessageDto } from '@modules/forum/controllers/dtos/update-forum-message.dto';
import { BaseException } from '@core/exceptions/base.exception';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventActionEnum } from '@modules/event/application/create-event.service';
import { UpdateEntityEvent } from '@modules/event/infrastructure/events/update-entity.event';

@Injectable()
export class UpdateForumMessageService {
  constructor(
    @InjectRepository(ForumMessageRepository)
    private forumMessageRepository: ForumMessageRepository,
    @InjectRepository(ThemeRepository)
    private themeRepository: ThemeRepository,
    private eventEmitter: EventEmitter2,
  ) {}

  async update({ id, content }: UpdateForumMessageDto, userId: string) {
    const message = await this.forumMessageRepository.findById(id);
    if (!message) BaseException.BadRequest(null, 'Сообщение не найдено');
    message.message = content;
    this.eventEmitter.emit(
      EventActionEnum.UPDATE_ENTITY,
      new UpdateEntityEvent('сообщение форума', userId, 'Форум', message),
    );
    return await this.forumMessageRepository.save(message);
  }

  async moveForumMessage({ id, themeIdTo, setFirst }: MoveForumMessageDto) {
    const [message, themeTo, [messagesFromThemeTo]] = await Promise.all([
      this.forumMessageRepository.findById(id),
      this.themeRepository.findById(themeIdTo),
      this.forumMessageRepository.findByThemeId(themeIdTo, {}),
    ]);
    if (setFirst) {
      const fixedMessage = messagesFromThemeTo.find(m => m.isFixed);
      if (fixedMessage) {
        fixedMessage.unpin();
        await this.forumMessageRepository.save(fixedMessage);
      }
    }
    const themeFrom = message.theme;
    if (themeFrom.lastMessage.id === message.id) {
      themeFrom.lastMessage = (await this.forumMessageRepository.findTwoLastByThemeId(themeFrom.id))[1] || null;
    }
    message.move(themeTo, setFirst);
    themeFrom.subtractMessage();
    themeTo.addMessage(message, !messagesFromThemeTo.find(m => m.createdAt > message.createdAt));
    await Promise.all([this.forumMessageRepository.save(message), this.themeRepository.save(themeFrom)]);
    return { success: true };
  }
}

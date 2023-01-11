import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ForumMessageRepository, ThemeRepository } from '@modules/forum/infrastructure/database/forum.repository';
import { CreateForumMessageDto } from '@modules/forum/controllers/dtos/create-forum-message.dto';
import { UserRepository } from '@modules/user/infrastructure/database/user.repository';
import { UserException } from '@modules/user/infrastructure/exceptions/user.exception';
import { ThemeException } from '@modules/forum/infrastructure/exceptions/theme.exception';
import { ForumMessageEntity } from '@modules/forum/domain/forum-message.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventActionEnum } from '@modules/event/application/create-event.service';
import { CreateEntityEvent } from '@modules/event/infrastructure/events/create-entity.event';
import { ForumMessageCreatedEvent } from '@modules/event/infrastructure/events/forum-message-created.event';

@Injectable()
export class CreateForumMessageService {
  constructor(
    @InjectRepository(ForumMessageRepository)
    private forumMessageRepository: ForumMessageRepository,
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    @InjectRepository(ThemeRepository)
    private themeRepository: ThemeRepository,
    private eventEmitter: EventEmitter2,
  ) {}

  async create({ authorId, message, themeId }: CreateForumMessageDto, userId: string) {
    const [author, theme] = await Promise.all([
      this.userRepository.findById(authorId),
      this.themeRepository.findById(themeId),
    ]);
    if (!author) UserException.NotFound('Форум');
    if (!theme) ThemeException.NotFound();
    if (theme.isClosed)
      ThemeException.Closed(`Пользователь id=${userId}. Попытка отправки сообщения в закрытую тему id=${themeId}`);
    const forumMessage = new ForumMessageEntity(author, message, theme);
    await this.forumMessageRepository.save(forumMessage);
    this.eventEmitter.emit(
      EventActionEnum.FORUM_MESSAGE_CREATED,
      new ForumMessageCreatedEvent(forumMessage.id, themeId),
    );
    this.eventEmitter.emit(
      EventActionEnum.CREATE_ENTITY,
      new CreateEntityEvent('сообщение на форуме', userId, forumMessage.id, 'Форум'),
    );
    return forumMessage;
  }
}

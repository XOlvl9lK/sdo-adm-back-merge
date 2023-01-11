import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ForumRepository, ThemeRepository } from '@modules/forum/infrastructure/database/forum.repository';
import { CreateThemeDto } from '@modules/forum/controllers/dtos/create-theme.dto';
import { UserRepository } from '@modules/user/infrastructure/database/user.repository';
import { ForumException } from '@modules/forum/infrastructure/exceptions/forum.exception';
import { UserException } from '@modules/user/infrastructure/exceptions/user.exception';
import { ThemeEntity } from '@modules/forum/domain/theme.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventActionEnum } from '@modules/event/application/create-event.service';
import { CreateEntityEvent } from '@modules/event/infrastructure/events/create-entity.event';
import { ThemeCreatedEvent } from '@modules/event/infrastructure/events/theme-created.event';
import { BaseException } from '@core/exceptions/base.exception';

@Injectable()
export class CreateThemeService {
  constructor(
    @InjectRepository(ThemeRepository)
    private themeRepository: ThemeRepository,
    @InjectRepository(ForumRepository)
    private forumRepository: ForumRepository,
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private eventEmitter: EventEmitter2,
  ) {}

  async create({ title, description, forumId, authorId }: CreateThemeDto, userId: string) {
    const [forum, author] = await Promise.all([
      this.forumRepository.findById(forumId),
      this.userRepository.findById(authorId),
    ]);
    if (!forum) ForumException.NotFound();
    if (!author) UserException.NotFound('Форум');
    const theme = new ThemeEntity(title, description, author, forum);
    await this.themeRepository.save(theme);
    this.eventEmitter.emit(EventActionEnum.THEME_CREATED, new ThemeCreatedEvent(theme.id, forumId));
    this.eventEmitter.emit(
      EventActionEnum.CREATE_ENTITY,
      new CreateEntityEvent('тему форума', userId, theme.id, 'Форум'),
    );
    return theme;
  }
}

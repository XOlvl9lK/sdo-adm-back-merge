import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ForumRepository, ThemeRepository } from '@modules/forum/infrastructure/database/forum.repository';
import { ThemeException } from '@modules/forum/infrastructure/exceptions/theme.exception';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventActionEnum } from '@modules/event/application/create-event.service';
import { ThemeActionEnum, UpdateForumThemeEvent } from '@modules/event/infrastructure/events/update-forum-theme.event';
import { UpdateThemeDto } from '@modules/forum/controllers/dtos/update-theme.dto';
import { UpdateEntityEvent } from '@modules/event/infrastructure/events/update-entity.event';

@Injectable()
export class UpdateThemeService {
  constructor(
    @InjectRepository(ThemeRepository)
    private themeRepository: ThemeRepository,
    @InjectRepository(ForumRepository)
    private forumRepository: ForumRepository,
    private eventEmitter: EventEmitter2,
  ) {}

  async update({ id, title, description, forumId, leaveLink }: UpdateThemeDto, userId: string) {
    const [theme, forum] = await Promise.all([
      this.themeRepository.findById(id),
      this.forumRepository.findById(forumId),
    ]);
    if (!theme) ThemeException.NotFound();
    theme.update(title, forum, description, leaveLink);
    this.eventEmitter.emit(EventActionEnum.UPDATE_ENTITY, new UpdateEntityEvent('тему форума', userId, 'Форум', theme));
    return await this.themeRepository.save(theme);
  }

  async close(id: string, userId: string) {
    const theme = await this.themeRepository.findById(id);
    if (!theme) ThemeException.NotFound();
    theme.close();
    this.eventEmitter.emit(
      EventActionEnum.UPDATE_FORUM_THEME,
      new UpdateForumThemeEvent(userId, ThemeActionEnum.CLOSE, theme.id),
    );
    return await this.themeRepository.save(theme);
  }

  async fix(id: string, userId: string) {
    const theme = await this.themeRepository.findById(id);
    if (!theme) ThemeException.NotFound();
    theme.fix();
    this.eventEmitter.emit(
      EventActionEnum.UPDATE_FORUM_THEME,
      new UpdateForumThemeEvent(userId, ThemeActionEnum.FIX, theme.id),
    );
    return await this.themeRepository.save(theme);
  }

  async open(id: string, userId: string) {
    const theme = await this.themeRepository.findById(id);
    if (!theme) ThemeException.NotFound();
    theme.open();
    this.eventEmitter.emit(
      EventActionEnum.UPDATE_FORUM_THEME,
      new UpdateForumThemeEvent(userId, ThemeActionEnum.OPEN, theme.id),
    );
    return await this.themeRepository.save(theme);
  }

  async unpin(id: string, userId: string) {
    const theme = await this.themeRepository.findById(id);
    if (!theme) ThemeException.NotFound();
    theme.unpin();
    this.eventEmitter.emit(
      EventActionEnum.UPDATE_FORUM_THEME,
      new UpdateForumThemeEvent(userId, ThemeActionEnum.UNPIN, theme.id),
    );
    return await this.themeRepository.save(theme);
  }
}

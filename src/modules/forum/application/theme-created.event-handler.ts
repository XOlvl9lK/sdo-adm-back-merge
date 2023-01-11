import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ForumRepository, ThemeRepository } from '@modules/forum/infrastructure/database/forum.repository';
import { OnEvent } from '@nestjs/event-emitter';
import { EventActionEnum } from '@modules/event/application/create-event.service';
import { ThemeCreatedEvent } from '@modules/event/infrastructure/events/theme-created.event';

@Injectable()
export class ThemeCreatedEventHandler {
  constructor(
    @InjectRepository(ForumRepository)
    private forumRepository: ForumRepository,
    @InjectRepository(ThemeRepository)
    private themeRepository: ThemeRepository,
  ) {}

  @OnEvent(EventActionEnum.THEME_CREATED, { async: true })
  async handle({ forumId, themeId }: ThemeCreatedEvent) {
    const [forum, theme] = await Promise.all([
      this.forumRepository.findById(forumId),
      this.themeRepository.findById(themeId),
    ]);
    if (forum && theme) {
      forum.addTheme();
      await this.forumRepository.save(forum);
    }
  }
}

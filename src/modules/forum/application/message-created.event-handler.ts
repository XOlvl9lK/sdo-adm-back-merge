import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ForumMessageRepository,
  ForumRepository,
  ThemeRepository,
} from '@modules/forum/infrastructure/database/forum.repository';
import { OnEvent } from '@nestjs/event-emitter';
import { EventActionEnum } from '@modules/event/application/create-event.service';
import { ForumMessageCreatedEvent } from '@modules/event/infrastructure/events/forum-message-created.event';

@Injectable()
export class MessageCreatedEventHandler {
  constructor(
    @InjectRepository(ForumMessageRepository)
    private forumMessageRepository: ForumMessageRepository,
    @InjectRepository(ThemeRepository)
    private themeRepository: ThemeRepository,
    @InjectRepository(ForumRepository)
    private forumRepository: ForumRepository,
  ) {}

  @OnEvent(EventActionEnum.FORUM_MESSAGE_CREATED, { async: true })
  async handle({ themeId, messageId }: ForumMessageCreatedEvent) {
    const [theme, forumMessage] = await Promise.all([
      this.themeRepository.findById(themeId),
      this.forumMessageRepository.findById(messageId),
    ]);
    const forum = theme.forum;
    if (theme && forumMessage && forum) {
      theme.addMessage(forumMessage, true);
      await this.themeRepository.save(theme);
      forum.addMessage(forumMessage, theme);
      await this.forumRepository.save(forum);
    }
  }
}

import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { ForumMessageRepository } from '@modules/forum/infrastructure/database/forum.repository';
import { Connection } from 'typeorm';

@Injectable()
export class DeleteForumMessageService {
  constructor(
    @InjectConnection()
    private connection: Connection,
    @InjectRepository(ForumMessageRepository)
    private messageRepository: ForumMessageRepository,
  ) {}

  async delete(id: string) {
    const message = await this.messageRepository.findById(id);
    const theme = message.theme;

    const [forumMessages, themeMessages] = await Promise.all([
      this.messageRepository.findTwoLastByForumId(theme.forumId),
      this.messageRepository.findTwoLastByThemeId(theme.id),
    ]);
    const forum = forumMessages[0].theme.forum;

    if (theme.lastMessageId === message.id) {
      const lastMessage = themeMessages.find(({ id }) => id !== message.id) || null;
      theme.lastMessage = lastMessage;
    }
    theme.subtractMessage();

    if (forum.lastMessageId === message.id) {
      const lastMessage = forumMessages.find(({ id }) => id !== message.id) || null;
      forum.lastMessage = lastMessage;
      forum.lastRedactedTheme = lastMessage?.theme || null;
    }
    forum.totalMessages -= 1;

    return await this.connection.transaction(async manager => {
      await manager.save(forum);
      await manager.save(theme);
      return await manager.remove(message);
    });
  }
}

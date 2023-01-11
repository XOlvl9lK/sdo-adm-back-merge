import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ForumMessageRepository, ThemeRepository } from '@modules/forum/infrastructure/database/forum.repository';
import { RequestQuery } from '@core/libs/types';

@Injectable()
export class FindForumMessageService {
  constructor(
    @InjectRepository(ForumMessageRepository)
    private forumMessageRepository: ForumMessageRepository,
    @InjectRepository(ThemeRepository)
    private themeRepository: ThemeRepository,
  ) {}

  async findAll(search?: string) {
    if (search) {
      return await this.forumMessageRepository.findBySearch(search);
    }
    return await this.forumMessageRepository.find();
  }

  async findByThemeId(themeId: string, requestQuery: RequestQuery) {
    const [theme, [forumMessages, total]] = await Promise.all([
      this.themeRepository.findById(themeId),
      this.forumMessageRepository.findByThemeId(themeId, requestQuery),
    ]);
    return {
      total,
      data: {
        theme,
        forumMessages,
      },
    };
  }

  async findById(id: string) {
    return await this.forumMessageRepository.findById(id);
  }
}

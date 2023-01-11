import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ForumRepository, ThemeRepository } from '@modules/forum/infrastructure/database/forum.repository';
import { RequestQuery } from '@core/libs/types';

@Injectable()
export class FindThemeService {
  constructor(
    @InjectRepository(ThemeRepository)
    private themeRepository: ThemeRepository,
    @InjectRepository(ForumRepository)
    private forumRepository: ForumRepository,
  ) {}

  async findAll() {
    return await this.themeRepository.findAll();
  }

  async findByForumId(forumId: string, requestQuery: RequestQuery) {
    const [forum, [themes, total]] = await Promise.all([
      this.forumRepository.findById(forumId),
      this.themeRepository.findByForumId(forumId, requestQuery),
    ]);
    return {
      total,
      data: {
        forum,
        themes,
      },
    };
  }

  async findById(id: string) {
    return await this.themeRepository.findById(id);
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ForumRepository } from '@modules/forum/infrastructure/database/forum.repository';
import { RequestQuery } from '@core/libs/types';

@Injectable()
export class FindForumService {
  constructor(
    @InjectRepository(ForumRepository)
    private forumRepository: ForumRepository,
  ) {}

  async findAll(requestQuery: RequestQuery) {
    return await this.forumRepository.findAll(requestQuery);
  }

  async findById(id: string) {
    return await this.forumRepository.findById(id);
  }
}

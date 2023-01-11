import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NewsRepository } from '@modules/news/infrastructure/database/news.repository';
import { RequestQuery } from '@core/libs/types';

@Injectable()
export class FindNewsService {
  constructor(
    @InjectRepository(NewsRepository)
    private newsRepository: NewsRepository,
  ) {}

  async findAll(requestQuery: RequestQuery) {
    return await this.newsRepository.findAll(requestQuery);
  }

  async findById(id: string) {
    return await this.newsRepository.findById(id);
  }

  async findByGroupId(groupId: string, requestQuery: RequestQuery) {
    return await this.newsRepository.findByNewsGroupIdPublished(groupId, requestQuery);
  }
}

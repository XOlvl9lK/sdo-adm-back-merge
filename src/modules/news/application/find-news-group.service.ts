import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NewsGroupRepository } from '@modules/news/infrastructure/database/news-group.repository';
import { RequestQuery } from '@core/libs/types';
import { NewsRepository } from '@modules/news/infrastructure/database/news.repository';
import { LoggerService } from '@core/logger/logger.service';

@Injectable()
export class FindNewsGroupService {
  constructor(
    @InjectRepository(NewsGroupRepository)
    private newsGroupRepository: NewsGroupRepository,
    @InjectRepository(NewsRepository)
    private newsRepository: NewsRepository,
  ) {}

  async findAll(requestQuery: RequestQuery) {
    return await this.newsGroupRepository.findAll(requestQuery);
  }

  async findById(id: string, requestQuery: RequestQuery) {
    LoggerService.log('START FINDING', '[CONNECTION RESET PROBLEM]')
    const [newsGroup, [news, total]] = await Promise.all([
      this.newsGroupRepository.findById(id),
      this.newsRepository.findByNewsGroupId(id, requestQuery),
    ]);
    LoggerService.log('END FINDING', '[CONNECTION RESET PROBLEM]')
    return {
      total,
      data: {
        ...newsGroup,
        news,
      },
    };
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChapterRepository } from '@modules/chapter/infrastructure/database/chapter.repository';
import { RequestQuery } from '@core/libs/types';

@Injectable()
export class FindChapterService {
  constructor(
    @InjectRepository(ChapterRepository)
    private chapterRepository: ChapterRepository,
  ) {}

  async findAll(requestQuery: RequestQuery) {
    return await this.chapterRepository.findAll(requestQuery);
  }

  async findAllWithoutPagination(requestQuery: RequestQuery) {
    return await this.chapterRepository.findAllWithoutPagination(requestQuery);
  }

  async findById(id: string) {
    return await this.chapterRepository.findById(id);
  }
}

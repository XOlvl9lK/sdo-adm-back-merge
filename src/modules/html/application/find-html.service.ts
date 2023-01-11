import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HtmlRepository } from '@modules/html/infrastructure/database/html.repository';
import { PageEnum } from '@modules/html/domain/page-content.entity';
import { RequestQuery } from '@core/libs/types';

@Injectable()
export class FindHtmlService {
  constructor(
    @InjectRepository(HtmlRepository)
    private htmlRepository: HtmlRepository,
  ) {}

  async findAll(requestQuery: RequestQuery) {
    return await this.htmlRepository.findAll(requestQuery);
  }

  async findByPageType(pageType: PageEnum) {
    return await this.htmlRepository.findByPageType(pageType);
  }
}

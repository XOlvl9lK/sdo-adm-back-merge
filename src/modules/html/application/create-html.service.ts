import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HtmlRepository } from '@modules/html/infrastructure/database/html.repository';
import { CreateHtmlRequestDto } from '@modules/html/controllers/dtos/create-html.request-dto';
import { PageContentEntity, PageEnum } from '@modules/html/domain/page-content.entity';

@Injectable()
export class CreateHtmlService {
  constructor(
    @InjectRepository(HtmlRepository)
    private htmlRepository: HtmlRepository,
  ) {}

  async create({ content, description }: CreateHtmlRequestDto, pageType: PageEnum) {
    const page = new PageContentEntity(pageType, content, description);
    return await this.htmlRepository.save(page);
  }
}

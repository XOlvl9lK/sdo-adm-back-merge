import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HtmlRepository } from '@modules/html/infrastructure/database/html.repository';
import { CreateHtmlRequestDto } from '@modules/html/controllers/dtos/create-html.request-dto';
import { CreateHtmlService } from '@modules/html/application/create-html.service';
import { PageEnum } from '@modules/html/domain/page-content.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventActionEnum } from '@modules/event/application/create-event.service';
import { UpdateEntityEvent } from '@modules/event/infrastructure/events/update-entity.event';

@Injectable()
export class UpdateHtmlService {
  constructor(
    @InjectRepository(HtmlRepository)
    private htmlRepository: HtmlRepository,
    private createHtmlService: CreateHtmlService,
    private eventEmitter: EventEmitter2,
  ) {}

  async update({ content, description }: CreateHtmlRequestDto, pageType: PageEnum, userId: string) {
    const page = await this.htmlRepository.findByPageType(pageType);
    if (!page) return await this.createHtmlService.create({ content, description }, pageType);
    page.content = content;
    page.description = description;
    this.eventEmitter.emit(
      EventActionEnum.UPDATE_ENTITY,
      new UpdateEntityEvent(`содержание страницы ${pageType}`, userId, 'Управление содержимым', page),
    );
    return await this.htmlRepository.save(page);
  }
}

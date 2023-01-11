import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NewsGroupRepository } from '@modules/news/infrastructure/database/news-group.repository';
import { UpdateNewsGroupDto } from '@modules/news/controllers/dtos/update-news-group.dto';
import { BaseException } from '@core/exceptions/base.exception';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventActionEnum } from '@modules/event/application/create-event.service';
import { UpdateEntityEvent } from '@modules/event/infrastructure/events/update-entity.event';

@Injectable()
export class UpdateNewsGroupService {
  constructor(
    @InjectRepository(NewsGroupRepository)
    private newsGroupRepository: NewsGroupRepository,
    private eventEmitter: EventEmitter2,
  ) {}

  async update({ id, title, description, parentGroupId }: UpdateNewsGroupDto, userId) {
    if (id === parentGroupId) BaseException.BadRequest(null, 'Родительская группа не может быть самой себе');
    const newsGroup = await this.newsGroupRepository.findById(id);
    const parentGroup = await this.newsGroupRepository.findById(parentGroupId);
    if (!newsGroup) BaseException.BadRequest(null, 'Новостная группа с таким id не найдена');
    if (!newsGroup) BaseException.BadRequest(null, 'Родительская группа с таким id не найдена');
    newsGroup.update(title, description, parentGroup);
    this.eventEmitter.emit(
      EventActionEnum.UPDATE_ENTITY,
      new UpdateEntityEvent('группу новостей', userId, 'Банк новостей', newsGroup),
    );
    return await this.newsGroupRepository.save(newsGroup);
  }
}

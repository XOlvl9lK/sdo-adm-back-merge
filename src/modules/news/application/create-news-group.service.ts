import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NewsGroupRepository } from '@modules/news/infrastructure/database/news-group.repository';
import { CreateNewsGroupDto } from '@modules/news/controllers/dtos/create-news-group.dto';
import { NewsGroupEntity } from '@modules/news/domain/news-group.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventActionEnum } from '@modules/event/application/create-event.service';
import { CreateEntityEvent } from '@modules/event/infrastructure/events/create-entity.event';
import { BaseException } from '@core/exceptions/base.exception';

@Injectable()
export class CreateNewsGroupService {
  constructor(
    @InjectRepository(NewsGroupRepository)
    private newsGroupRepository: NewsGroupRepository,
    private eventEmitter: EventEmitter2,
  ) {}

  async create({ title, description, parentGroupId }: CreateNewsGroupDto, userId: string) {
    const parentNewsGroup = await this.newsGroupRepository.findById(parentGroupId);
    const newsGroup = new NewsGroupEntity(title, parentNewsGroup, description);
    this.eventEmitter.emit(
      EventActionEnum.CREATE_ENTITY,
      new CreateEntityEvent('группу новостей', userId, newsGroup.id, 'Банк новостей'),
    );
    return await this.newsGroupRepository.save(newsGroup);
  }
}

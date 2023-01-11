import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NewsRepository } from '@modules/news/infrastructure/database/news.repository';
import { NewsGroupRepository } from '@modules/news/infrastructure/database/news-group.repository';
import { MoveNewsDto, UpdateNewsDto } from '@modules/news/controllers/dtos/update-news.dto';
import { BaseException } from '@core/exceptions/base.exception';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventActionEnum } from '@modules/event/application/create-event.service';
import { UpdateEntityEvent } from '@modules/event/infrastructure/events/update-entity.event';

@Injectable()
export class UpdateNewsService {
  constructor(
    @InjectRepository(NewsRepository)
    private newsRepository: NewsRepository,
    @InjectRepository(NewsGroupRepository)
    private newsGroupRepository: NewsGroupRepository,
    private eventEmitter: EventEmitter2,
  ) {}

  async update({ id, newsGroupId, createdAt, preview, content, title, isPublished }: UpdateNewsDto, userId: string) {
    const [news, newsGroup] = await Promise.all([
      this.newsRepository.findById(id),
      this.newsGroupRepository.findById(newsGroupId),
    ]);
    if (!news) BaseException.BadRequest(null, 'Новость с таким id не найдена');
    if (!newsGroup) BaseException.BadRequest(null, 'Группа новостей с таким id не найдена');
    news.update(title, content, preview, new Date(createdAt), isPublished, newsGroup);
    this.eventEmitter.emit(
      EventActionEnum.UPDATE_ENTITY,
      new UpdateEntityEvent('новость', userId, 'Банк новостей', news),
    );
    return await this.newsRepository.save(news);
  }

  async move({ newsIds, newsGroupToId }: MoveNewsDto) {
    const [news, newsGroupTo] = await Promise.all([
      this.newsRepository.findByIds(newsIds),
      this.newsGroupRepository.findById(newsGroupToId),
    ]);
    if (!newsGroupTo) BaseException.BadRequest(null, 'Группа новостей с таким id не найдена');
    news.forEach(n => (n.newsGroup = newsGroupTo));
    return await this.newsRepository.save(news);
  }
}

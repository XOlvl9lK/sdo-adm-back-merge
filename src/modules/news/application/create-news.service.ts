import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NewsRepository } from '@modules/news/infrastructure/database/news.repository';
import { CreateNewsRequestDto } from '@modules/news/controllers/dtos/create-news.request-dto';
import { NewsEntity } from '@modules/news/domain/news.entity';
import { NewsGroupRepository } from '@modules/news/infrastructure/database/news-group.repository';
import { BaseException } from '@core/exceptions/base.exception';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventActionEnum } from '@modules/event/application/create-event.service';
import { CreateEntityEvent } from '@modules/event/infrastructure/events/create-entity.event';
import { UserRepository } from '@modules/user/infrastructure/database/user.repository';

@Injectable()
export class CreateNewsService {
  constructor(
    @InjectRepository(NewsRepository)
    private newsRepository: NewsRepository,
    @InjectRepository(NewsGroupRepository)
    private newsGroupRepository: NewsGroupRepository,
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private eventEmitter: EventEmitter2,
  ) {}

  async create({ title, content, createdAt, newsGroupId, preview, isPublished }: CreateNewsRequestDto, userId: string) {
    const [newsGroup, user] = await Promise.all([
      this.newsGroupRepository.findById(newsGroupId),
      this.userRepository.findById(userId),
    ]);
    if (!newsGroup) BaseException.BadRequest(null, 'Группа новостей с таки id не найдена');
    const news = new NewsEntity(title, content, preview, new Date(createdAt), isPublished, newsGroup, user);
    this.eventEmitter.emit(
      EventActionEnum.CREATE_ENTITY,
      new CreateEntityEvent('новость', userId, news.id, 'Банк новостей'),
    );
    return await this.newsRepository.save(news);
  }
}

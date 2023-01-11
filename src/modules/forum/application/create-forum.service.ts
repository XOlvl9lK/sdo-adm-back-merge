import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ForumRepository } from '@modules/forum/infrastructure/database/forum.repository';
import { CreateForumDto } from '@modules/forum/controllers/dtos/create-forum.dto';
import { ForumEntity } from '@modules/forum/domain/forum.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventActionEnum } from '@modules/event/application/create-event.service';
import { CreateEntityEvent } from '@modules/event/infrastructure/events/create-entity.event';
import { BaseException } from '@core/exceptions/base.exception';

@Injectable()
export class CreateForumService {
  constructor(
    @InjectRepository(ForumRepository)
    private forumRepository: ForumRepository,
    private eventEmitter: EventEmitter2,
  ) {}

  async create({ title, description }: CreateForumDto, userId: string) {
    const forum = new ForumEntity(title, description);
    this.eventEmitter.emit(EventActionEnum.CREATE_ENTITY, new CreateEntityEvent('форум', userId, forum.id, 'Форум'));
    return await this.forumRepository.save(forum);
  }
}

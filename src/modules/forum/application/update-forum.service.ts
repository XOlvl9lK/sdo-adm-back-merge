import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ForumRepository } from '@modules/forum/infrastructure/database/forum.repository';
import { ChangeForumOrderDto, UpdateForumDto } from '@modules/forum/controllers/dtos/update-forum.dto';
import { ForumException } from '@modules/forum/infrastructure/exceptions/forum.exception';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventActionEnum } from '@modules/event/application/create-event.service';
import { UpdateEntityEvent } from '@modules/event/infrastructure/events/update-entity.event';
import { ChangeOrderEvent } from '@modules/event/infrastructure/events/change-order.event';
import { ChangeOrderHelper } from '@core/libs/change-order.helper';

@Injectable()
export class UpdateForumService {
  constructor(
    @InjectRepository(ForumRepository)
    private forumRepository: ForumRepository,
    private eventEmitter: EventEmitter2,
  ) {}

  async update({ id, title, description }: UpdateForumDto, userId: string) {
    const forum = await this.forumRepository.findById(id);
    if (!forum) ForumException.NotFound();
    forum.update(title, description);
    this.eventEmitter.emit(EventActionEnum.UPDATE_ENTITY, new UpdateEntityEvent('форум', userId, 'Форум', forum));
    return await this.forumRepository.save(forum);
  }

  async changeOrder({ sortActionType, forumId }: ChangeForumOrderDto, userId: string) {
    const [forums] = await this.forumRepository.findAll({});
    ChangeOrderHelper.changeOrder(forums, forumId, sortActionType);
    this.eventEmitter.emit(
      EventActionEnum.CHANGE_ORDER,
      new ChangeOrderEvent(userId, forumId, 'форум', 'Форум'),
    );
    return await this.forumRepository.save(forums);
  }
}

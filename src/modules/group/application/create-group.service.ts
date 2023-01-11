import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupRepository } from '@modules/group/infrastructure/database/group.repository';
import { CreateGroupRequestDto } from '@modules/group/controllers/dtos/create-group.request-dto';
import { GroupEntity } from '@modules/group/domain/group.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventActionEnum } from '@modules/event/application/create-event.service';
import { CreateEntityEvent } from '@modules/event/infrastructure/events/create-entity.event';
import { BaseException } from '@core/exceptions/base.exception';

@Injectable()
export class CreateGroupService {
  constructor(
    @InjectRepository(GroupRepository)
    private groupRepository: GroupRepository,
    private eventEmitter: EventEmitter2,
  ) {}

  async create({ title, description }: CreateGroupRequestDto, userId: string) {
    const group = new GroupEntity(title, description);
    this.eventEmitter.emit(EventActionEnum.CREATE_ENTITY, new CreateEntityEvent('группу', userId, group.id, 'Группы'));
    return await this.groupRepository.save(group);
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventRepository } from '@modules/event/infrastructure/database/event.repository';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventActionEnum } from '@modules/event/application/create-event.service';
import { TruncateEventEvent } from '@modules/event/infrastructure/events/truncate-event.event';

@Injectable()
export class DeleteEventService {
  constructor(
    @InjectRepository(EventRepository)
    private eventRepository: EventRepository,
    private eventEmitter: EventEmitter2,
  ) {}

  async deleteAll(userId: string) {
    await this.eventRepository.clear();
    return this.eventEmitter.emit(EventActionEnum.TRUNCATE_EVENT, new TruncateEventEvent(userId));
  }
}

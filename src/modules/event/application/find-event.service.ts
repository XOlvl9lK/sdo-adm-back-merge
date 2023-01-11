import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventRepository } from '@modules/event/infrastructure/database/event.repository';
import { RequestQuery } from '@core/libs/types';

@Injectable()
export class FindEventService {
  constructor(
    @InjectRepository(EventRepository)
    private eventRepository: EventRepository,
  ) {}

  async getAll(requestQuery: RequestQuery) {
    return await this.eventRepository.getAll(requestQuery);
  }

  async findById(id: string) {
    return await this.eventRepository.findById(id);
  }

  async findByIds(ids: string[]) {
    return await this.eventRepository.findByIds(ids)
  }
}

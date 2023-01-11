import { EntityRepository } from 'typeorm';
import { EventEntity } from '@modules/event/domain/event.entity';
import { BaseRepository } from '@core/database/base.repository';
import { RequestQuery } from '@core/libs/types';

@EntityRepository(EventEntity)
export class EventRepository extends BaseRepository<EventEntity> {
  getAll({ sort, page, pageSize, search, offset }: RequestQuery) {
    return this.findAndCount({
      where: {
        ...this.processSearchQuery(search, 'description'),
      },
      ...this.processSortQuery(sort),
      ...this.processPaginationQuery(page, pageSize, offset),
    });
  }
}

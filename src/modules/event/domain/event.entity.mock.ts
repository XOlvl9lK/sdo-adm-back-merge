import { mockBaseEntity } from '@core/domain/base.entity.mock';
import { EventEntity, EventTypeEnum } from '@modules/event/domain/event.entity';
import { Random } from '@core/test/random';
import { plainToInstance } from 'class-transformer';

const mockEvent = {
  ...mockBaseEntity,
  type: EventTypeEnum.INFO,
  page: Random.lorem,
  description: Random.lorem,
  authData: Random.lorem,
};

export const mockEventInstance = plainToInstance(EventEntity, mockEvent);

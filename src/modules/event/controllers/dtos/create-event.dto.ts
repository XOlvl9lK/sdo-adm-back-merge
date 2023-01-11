import { EventTypeEnum } from '@modules/event/domain/event.entity';

export class CreateEventDto {
  type: EventTypeEnum;
  page: string;
  description: string;
  object?: string;
  authData?: string;
}

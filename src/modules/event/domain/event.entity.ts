import { Column, Entity } from 'typeorm';
import { BaseEntity } from '@core/domain/base.entity';

export enum EventTypeEnum {
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
}

@Entity('event')
export class EventEntity extends BaseEntity {
  @Column({ type: 'text', nullable: false, comment: 'Тип события' })
  type: EventTypeEnum;

  @Column({
    type: 'text',
    nullable: false,
    comment: 'Страница, на которой произошло событие',
  })
  page: string;

  @Column({ type: 'text', nullable: true, comment: 'Описание события' })
  object?: string;

  @Column({ type: 'text', nullable: false, comment: 'Описание события' })
  description: string;

  @Column({
    type: 'text',
    nullable: true,
    name: 'auth_data',
    comment: 'Данные авторизации',
  })
  authData?: string;

  constructor(type: EventTypeEnum, page: string, description: string, object?: string, authData?: string) {
    super();
    this.type = type;
    this.page = page;
    this.description = description;
    this.object = object;
    this.authData = authData;
  }
}

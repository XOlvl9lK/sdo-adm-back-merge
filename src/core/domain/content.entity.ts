import { BaseEntity } from '@core/domain/base.entity';
import { Column } from 'typeorm';

export class ContentEntity extends BaseEntity {
  @Column({ type: 'text', nullable: false, comment: 'Наименование контента' })
  title: string;

  @Column({ type: 'text', nullable: true, comment: 'Описание контента' })
  description?: string;

  constructor(title: string, description?: string) {
    super();
    this.title = title?.trim();
    this.description = description ? description.trim() : null;
  }
}

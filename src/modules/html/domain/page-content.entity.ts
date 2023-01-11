import { BaseEntity } from '@core/domain/base.entity';
import { Column, Entity } from 'typeorm';

export enum PageEnum {
  MAIN = 'MAIN',
  CONTACTS = 'CONTACTS',
  VERIFICATION_CENTRE = 'VERIFICATION_CENTRE',
}

@Entity('page_content')
export class PageContentEntity extends BaseEntity {
  @Column({ type: 'text', nullable: false, unique: true, comment: 'Страница' })
  page: PageEnum;

  @Column({ type: 'text', nullable: false, comment: 'Контент' })
  content: string;

  @Column({ type: 'text', nullable: true, comment: 'Описание' })
  description?: string;

  constructor(page: PageEnum, content: string, description?: string) {
    super();
    this.page = page;
    this.content = content;
    this.description = description;
  }
}

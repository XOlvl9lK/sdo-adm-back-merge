import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ContentEntity } from '@core/domain/content.entity';

@Entity('news_group')
export class NewsGroupEntity extends ContentEntity {
  @ManyToOne(() => NewsGroupEntity)
  @JoinColumn({ name: 'parent_group_id' })
  parentGroup: NewsGroupEntity;

  @Column({
    name: 'parent_group_id',
    nullable: true,
    comment: 'ID родительской группы новостей',
  })
  parentGroupId: string;

  constructor(title: string, parentGroup: NewsGroupEntity, description?: string) {
    super(title, description);
    this.parentGroup = parentGroup;
  }

  update(title: string, description?: string, parentGroup?: NewsGroupEntity) {
    this.title = title.trim();
    this.description = description ? description.trim() : null;
    this.parentGroup = parentGroup;
  }
}

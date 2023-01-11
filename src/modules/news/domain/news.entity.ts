import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '@core/domain/base.entity';
import { NewsGroupEntity } from '@modules/news/domain/news-group.entity';
import { UserEntity } from '@modules/user/domain/user.entity';

@Entity('news')
export class NewsEntity extends BaseEntity {
  @Column({ type: 'text', nullable: true, comment: 'Заголовок' })
  title: string;

  @Column({ type: 'text', nullable: false, comment: 'Предпросмотр контента' })
  preview: string;

  @Column({ type: 'text', nullable: false, comment: 'Контент' })
  content: string;

  @Column({ type: 'timestamp', nullable: false, comment: 'Дата создания' })
  createdAt: Date;

  @Column({ type: 'boolean', comment: 'Опубликовано' })
  isPublished: boolean;

  @Column({ type: 'timestamp', nullable: true, comment: 'Дата публикации' })
  publishDate: Date;

  @ManyToOne(() => NewsGroupEntity)
  @JoinColumn({ name: 'news_group_id' })
  newsGroup: NewsGroupEntity;

  @Column({ name: 'news_group_id', comment: 'ID группы новостей' })
  news_group_id: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn()
  author: UserEntity;

  @Column({ nullable: true, comment: 'ID автора' })
  authorId: string;

  constructor(
    title: string,
    content: string,
    preview: string,
    createdAt: Date,
    isPublished: boolean,
    newsGroup: NewsGroupEntity,
    auhtor: UserEntity,
  ) {
    super();
    this.update(title, content, preview, createdAt, isPublished, newsGroup);
    this.author = auhtor;
  }

  update(
    title: string,
    content: string,
    preview: string,
    createdAt: Date,
    isPublished: boolean,
    newsGroup: NewsGroupEntity,
  ) {
    this.title = title?.trim();
    this.content = content;
    this.preview = preview;
    this.createdAt = createdAt;
    this.newsGroup = newsGroup;
    if (!this.isPublished && isPublished) {
      this.publishDate = new Date();
    }
    this.isPublished = isPublished;
  }
}

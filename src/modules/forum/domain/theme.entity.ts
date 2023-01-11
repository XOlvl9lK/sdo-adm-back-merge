import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { ContentEntity } from '@core/domain/content.entity';
import { UserEntity } from '@modules/user/domain/user.entity';
import { ForumMessageEntity } from '@modules/forum/domain/forum-message.entity';
import { ForumEntity } from '@modules/forum/domain/forum.entity';

@Entity('theme')
export class ThemeEntity extends ContentEntity {
  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'author_id' })
  author: UserEntity;

  @Column({ name: 'author_id', nullable: true, comment: 'ID автора темы' })
  authorId: string;

  @ManyToOne(() => ForumEntity)
  @JoinColumn({ name: 'forum_id' })
  forum: ForumEntity;

  @Column({ name: 'forum_id', nullable: true, comment: 'ID Форума' })
  forumId: string;

  @Column({
    type: 'int',
    default: 0,
    name: 'total_messages',
    comment: 'Кол-во сообщений',
  })
  totalMessages: number;

  @OneToOne(() => ForumMessageEntity)
  @JoinColumn({ name: 'last_message_id' })
  lastMessage: ForumMessageEntity;

  @Column({
    name: 'last_message_id',
    nullable: true,
    comment: 'Последние сообщение',
  })
  lastMessageId: string;

  @Column({
    type: 'boolean',
    default: false,
    name: 'is_fixed',
    comment: 'Закреплена',
  })
  isFixed: boolean;

  @Column({
    type: 'boolean',
    default: false,
    name: 'is_closed',
    comment: 'Закрыта',
  })
  isClosed: boolean;

  @Column('simple-array', { nullable: true, comment: 'ID старых тем' })
  leavedLinks: string[];

  constructor(title: string, description: string, author: UserEntity, forum: ForumEntity) {
    super(title, description);
    this.author = author;
    this.forum = forum;
  }

  addMessage(message: ForumMessageEntity, isLast: boolean) {
    isLast && (this.lastMessage = message);
    this.totalMessages = this.totalMessages + 1;
  }

  subtractMessage() {
    const { totalMessages } = this;
    this.totalMessages = totalMessages < 0 ? 0 : totalMessages - 1;
  }

  update(title: string, forum: ForumEntity, description?: string, leaveLink?: boolean) {
    this.title = title.trim();
    this.description = description ? description.trim() : null;
    if (forum.id !== this.forum.id && leaveLink) {
      if (!this.leavedLinks) {
        this.leavedLinks = [this.forum.id];
      } else {
        this.leavedLinks.push(this.forum.id);
      }
    }
    if (this.leavedLinks) this.leavedLinks = this.leavedLinks.filter(l => l !== forum.id);
    this.forum = forum;
  }

  close() {
    this.isClosed = true;
  }

  open() {
    this.isClosed = false;
  }

  fix() {
    this.isFixed = true;
  }

  unpin() {
    this.isFixed = false;
  }
}

import { Column, Entity, Generated, JoinColumn, OneToOne } from 'typeorm';
import { ContentEntity } from '@core/domain/content.entity';
import { ForumMessageEntity } from '@modules/forum/domain/forum-message.entity';
import { ThemeEntity } from '@modules/forum/domain/theme.entity';
import { IOrderable } from '@core/domain/orderable.interface';

@Entity('forum')
export class ForumEntity extends ContentEntity implements IOrderable {
  @Column({ type: 'int', default: 0, comment: 'Кол-во тем' })
  totalThemes: number;

  @Column({ type: 'int', default: 0, comment: 'Кол-во сообщений' })
  totalMessages: number;

  @OneToOne(() => ForumMessageEntity)
  @JoinColumn()
  lastMessage: ForumMessageEntity;

  @Column({ nullable: true, comment: 'ID последнего сообщения' })
  lastMessageId: string;

  @OneToOne(() => ThemeEntity)
  @JoinColumn()
  lastRedactedTheme: ThemeEntity;

  @Column({ nullable: true, comment: 'ID последней отредактированной темы' })
  lastRedactedThemeId: string;

  @Generated('increment')
  @Column({ type: 'int', nullable: true, comment: 'Порядок' })
  order: number;

  @Column({ type: 'boolean', default: false, comment: 'Удалён' })
  isDeleted: boolean;

  constructor(title: string, description?: string) {
    super(title, description);
  }

  addTheme() {
    this.totalThemes = this.totalThemes + 1;
  }

  addMessage(lastMessage: ForumMessageEntity, lastRedactedTheme: ThemeEntity) {
    this.lastMessage = lastMessage;
    this.lastRedactedTheme = lastRedactedTheme;
    this.totalMessages = this.totalMessages + 1;
  }

  update(title: string, description?: string) {
    this.title = title.trim();
    this.description = description ? description.trim() : null;
  }
}

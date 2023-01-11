import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '@core/domain/base.entity';
import { UserEntity } from '@modules/user/domain/user.entity';
import { ThemeEntity } from '@modules/forum/domain/theme.entity';

@Entity('forum_message')
export class ForumMessageEntity extends BaseEntity {
  @ManyToOne(() => UserEntity, {
    cascade: true,
  })
  @JoinColumn()
  author: UserEntity;

  @Column({ nullable: true, comment: 'ID автора' })
  authorId: string;

  @ManyToOne(() => ThemeEntity, {
    cascade: true,
  })
  @JoinColumn()
  theme: ThemeEntity;

  @Column({ nullable: true, comment: 'ID темы' })
  themeId: string;

  @Column({ type: 'text', nullable: false, comment: 'Сообщение' })
  message: string;

  @Column({ type: 'boolean', default: false, comment: 'Закреплено' })
  isFixed: boolean;

  constructor(author: UserEntity, message: string, theme: ThemeEntity) {
    super();
    this.author = author;
    this.message = message;
    this.theme = theme;
  }

  move(themeTo: ThemeEntity, setFirst: boolean) {
    this.theme = themeTo;
    if (setFirst) {
      this.fix();
    }
  }

  fix() {
    this.isFixed = true;
  }

  unpin() {
    this.isFixed = false;
  }
}

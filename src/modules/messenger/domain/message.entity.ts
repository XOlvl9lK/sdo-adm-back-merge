import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '@core/domain/base.entity';
import { UserEntity } from '@modules/user/domain/user.entity';

export enum MessageStatusEnum {
  UNREAD = 'UNREAD',
  READ = 'READ',
}

export enum MessageTypeEnum {
  INCOMING = 'INCOMING',
  OUTGOING = 'OUTGOING',
  DRAFT = 'DRAFT',
  BASKET = 'BASKET',
}

@Entity('message')
export class MessageEntity extends BaseEntity {
  @Column({ type: 'text', nullable: false, comment: 'Тема' })
  theme: string;

  @Column({ type: 'text', nullable: false, comment: 'Сообщение' })
  content: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn()
  receiver: UserEntity;

  @Column({ nullable: true, comment: 'ID получателя' })
  receiverId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn()
  sender: UserEntity;

  @Column({ nullable: true, comment: 'ID отправителя' })
  senderId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn()
  basketOwner: UserEntity;

  @Column({ nullable: true, comment: 'ID владельца корзины' })
  basketOwnerId: string;

  @Column({ type: 'text', nullable: false, comment: 'Статус сообщения' })
  status: MessageStatusEnum;

  @Column({ type: 'text', nullable: false, comment: 'Тип сообщения' })
  type: MessageTypeEnum;

  constructor(
    theme: string,
    content: string,
    status: MessageStatusEnum,
    type: MessageTypeEnum,
    sender: UserEntity,
    receiver?: UserEntity,
  ) {
    super();
    this.theme = theme?.trim();
    this.content = content;
    this.receiver = receiver;
    this.sender = sender;
    this.status = status;
    this.type = type;
  }

  static createIncomingMessage(theme: string, content: string, receiver: UserEntity, sender: UserEntity) {
    return new MessageEntity(theme, content, MessageStatusEnum.UNREAD, MessageTypeEnum.INCOMING, sender, receiver);
  }

  static createOutgoingMessage(theme: string, content: string, receiver: UserEntity, sender: UserEntity) {
    return new MessageEntity(theme, content, MessageStatusEnum.READ, MessageTypeEnum.OUTGOING, sender, receiver);
  }

  static createDraftMessage(theme: string, content: string, sender: UserEntity, receiver?: UserEntity) {
    return new MessageEntity(theme, content, MessageStatusEnum.READ, MessageTypeEnum.DRAFT, sender, receiver);
  }

  moveToBasket(user: UserEntity) {
    this.type = MessageTypeEnum.BASKET;
    this.basketOwner = user;
  }

  isUserOwnsMessage(userId: string) {
    return this.receiver.id === userId || this.sender.id === userId;
  }

  updateDraft(theme: string, content: string, receiver: UserEntity) {
    if (this.type !== MessageTypeEnum.DRAFT) return;
    this.theme = theme;
    this.content = content;
    this.receiver = receiver;
  }
}

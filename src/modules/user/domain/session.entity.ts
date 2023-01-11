import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { UserEntity } from '@modules/user/domain/user.entity';
import { add } from 'date-fns';
import { BaseEntity } from '@core/domain/base.entity';
import { Exclude } from 'class-transformer';

@Entity('session')
export class SessionEntity extends BaseEntity {
  @Exclude()
  @Column({
    type: 'text',
    nullable: false,
    name: 'refresh_token',
    comment: 'Токен для обновления сессии',
  })
  refresh_token: string;

  @OneToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ name: 'user_id', nullable: true, comment: 'ID пользователя' })
  userId: string;

  @Column({
    type: 'timestamp',
    nullable: false,
    name: 'expiration_date',
    comment: 'Дата истечения сессии',
  })
  expirationDate: Date;

  @Column({ type: 'text', nullable: true, comment: 'IP пользователя' })
  ip?: string;

  @Column({
    type: 'text',
    nullable: true,
    name: 'last_page',
    comment: 'Последняя посещённая страница',
  })
  lastPage?: string;

  @Column({
    type: 'boolean',
    default: false,
    comment: 'Признак того, что пользователь в сети',
  })
  isConnected: boolean;

  constructor(user: UserEntity) {
    super();
    this.user = user;
    this.refresh_token = uuidv4();
    this.expirationDate = add(new Date(), { hours: 2 });
  }

  isValid() {
    return new Date() < this.expirationDate;
  }

  update(ip: string, lastPage: string) {
    this.ip = ip;
    this.lastPage = lastPage;
  }

  prolong() {
    this.expirationDate = add(new Date(), { hours: 2 });
  }

  connect() {
    this.isConnected = true;
  }

  disconnect() {
    this.isConnected = false;
  }
}

import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { ContentEntity } from '@core/domain/content.entity';
import { UserEntity } from '@modules/user/domain/user.entity';
import { BaseEntity } from '@core/domain/base.entity';

@Entity('group')
export class GroupEntity extends ContentEntity {
  @OneToMany(() => UserInGroupEntity, userInGroup => userInGroup.group, {
    cascade: true,
  })
  users: UserInGroupEntity[];

  @Column({
    type: 'int',
    nullable: false,
    default: 0,
    comment: 'Количество пользователей',
  })
  totalUsers: number;

  constructor(title: string, description: string) {
    super(title, description);
  }

  addUser(user: UserInGroupEntity): void {
    if (this.users) {
      this.users.push(user);
    } else {
      this.users = [user];
    }
    this.totalUsers++;
  }

  addUsers(users: UserInGroupEntity[]): void {
    if (this.users) {
      this.users.push(...users);
    } else {
      this.users = users;
    }
    this.totalUsers = this.users.length;
  }

  removeUsers(userIds: string[]): void {
    if (this.users) {
      this.users = this.users.filter(user => !userIds.includes(user.id));
      this.totalUsers = this.users.length;
    }
  }

  alreadyInGroup(userId: string): boolean {
    return !!this.users.find(user => user.user.id === userId);
  }

  update(title: string, description: string) {
    this.title = title.trim();
    this.description = description ? description.trim() : null;
  }
}

@Entity()
export class UserInGroupEntity extends BaseEntity {
  @ManyToOne(() => GroupEntity)
  group: GroupEntity;

  @ManyToOne(() => UserEntity)
  user: UserEntity;

  constructor(group: GroupEntity, user: UserEntity) {
    super();
    this.group = group;
    this.user = user;
  }
}

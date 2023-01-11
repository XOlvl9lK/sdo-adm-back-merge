import { ChildEntity, Column, Entity, JoinColumn, ManyToOne, OneToOne, TableInheritance } from 'typeorm';
import { BaseEntity } from '@core/domain/base.entity';
import { EducationElementEntity } from '@modules/education-program/domain/education-element.entity';
import { UserEntity } from '@modules/user/domain/user.entity';
import { GroupEntity } from '@modules/group/domain/group.entity';
import { AssignmentEntity } from '@modules/education-request/domain/assignment.entity';

export enum EducationRequestStatusEnum {
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  NOT_PROCESSED = 'NOT PROCESSED',
}

export enum EducationRequestOwnerTypeEnum {
  USER = 'USER',
  GROUP = 'GROUP',
}

@Entity('education_request')
@TableInheritance({
  column: { type: 'text', name: 'type', comment: 'Тип заявки на обучение' },
})
export class EducationRequestEntity extends BaseEntity {
  @ManyToOne(() => EducationElementEntity, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  educationElement: EducationElementEntity;

  @Column({ nullable: true, comment: 'ID элемента образовательной программы' })
  educationElementId: string;

  @Column({ type: 'text', nullable: true, comment: 'Статус зачисления' })
  status: EducationRequestStatusEnum;

  @Column({
    type: 'text',
    nullable: false,
    default: EducationRequestOwnerTypeEnum.USER,
    comment: 'Тип владельца',
  })
  ownerType: EducationRequestOwnerTypeEnum;

  @Column({
    type: 'timestamp',
    nullable: true,
    comment: 'Дата начала действия',
  })
  validityFrom?: Date;

  @Column({
    type: 'timestamp',
    nullable: true,
    comment: 'Дата окончания действия',
  })
  validityTo?: Date;

  @OneToOne(() => AssignmentEntity)
  @JoinColumn({ name: 'assignmentId' })
  assignment?: AssignmentEntity;

  @Column({ nullable: true })
  assignmentId?: string;

  constructor(
    educationElement: EducationElementEntity,
    ownerType: EducationRequestOwnerTypeEnum,
    status: EducationRequestStatusEnum = EducationRequestStatusEnum.NOT_PROCESSED,
    validityFrom?: Date,
    validityTo?: Date,
  ) {
    super();
    this.educationElement = educationElement;
    this.ownerType = ownerType;
    this.status = status;
    this.validityFrom = validityFrom;
    this.validityTo = validityTo;
  }

  accept() {
    this.status = EducationRequestStatusEnum.ACCEPTED;
  }

  reject() {
    this.status = EducationRequestStatusEnum.REJECTED;
  }
}

@ChildEntity()
export class UserEducationRequestEntity extends EducationRequestEntity {
  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @Column({ nullable: true, comment: 'ID пользователя' })
  userId: string;

  @Column({
    type: 'boolean',
    default: true,
    comment: 'Признак инициализации юзером',
  })
  initiateByUser: boolean;

  constructor(educationElement: EducationElementEntity, user: UserEntity, status?: EducationRequestStatusEnum) {
    super(educationElement, EducationRequestOwnerTypeEnum.USER, status);
    this.user = user;
  }
}

@ChildEntity()
export class GroupEducationRequestEntity extends EducationRequestEntity {
  @ManyToOne(() => GroupEntity, {
    cascade: true,
  })
  @JoinColumn({ name: 'groupId' })
  group: GroupEntity;

  @Column({ nullable: true, comment: 'ID группы' })
  groupId: string;

  constructor(educationElement: EducationElementEntity, group: GroupEntity, validityFrom?: Date, validityTo?: Date) {
    super(
      educationElement,
      EducationRequestOwnerTypeEnum.GROUP,
      EducationRequestStatusEnum.ACCEPTED,
      validityFrom,
      validityTo,
    );
    this.group = group;
  }
}

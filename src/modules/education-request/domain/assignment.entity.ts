import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { BaseEntity } from '@core/domain/base.entity';
import { GroupEntity } from '@modules/group/domain/group.entity';
import { UserEntity } from '@modules/user/domain/user.entity';
import { EducationRequestOwnerTypeEnum } from '@modules/education-request/domain/education-request.entity';
import { EducationElementEntity } from '@modules/education-program/domain/education-element.entity';
import { TestSettingsEntity } from '@modules/education-program/domain/test-settings.entity';
import { CourseSettingsEntity } from '@modules/education-program/domain/course-settings.entity';
import { EducationProgramSettingsEntity } from '@modules/education-program/domain/education-program-settings.entity';
import { getValidityDate } from '@core/libs/get-validity-date';

@Entity('assignment')
export class AssignmentEntity extends BaseEntity {
  @ManyToOne(() => UserEntity, {
    cascade: true,
  })
  @JoinColumn()
  user?: UserEntity;

  @Column({ name: 'userId', nullable: true, comment: 'ID пользователя' })
  userId?: string;

  @ManyToOne(() => GroupEntity, {
    cascade: true,
  })
  @JoinColumn()
  group?: GroupEntity;

  @Column({ name: 'groupId', nullable: true, comment: 'ID группы' })
  groupId?: string;

  @ManyToOne(() => EducationElementEntity, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  educationElement: EducationElementEntity;

  @Column({
    name: 'educationElementId',
    nullable: true,
    comment: 'ID элемента образовательной программы',
  })
  educationElementId: string;

  @Column({
    type: 'text',
    nullable: false,
    default: EducationRequestOwnerTypeEnum.USER,
    comment: 'Тип владельца',
  })
  ownerType: EducationRequestOwnerTypeEnum;

  @OneToOne(() => TestSettingsEntity, {
    cascade: true,
  })
  @JoinColumn({ name: 'testSettingsId' })
  testSettings: TestSettingsEntity;

  @Column({ nullable: true, comment: 'ID Настроек теста' })
  testSettingsId?: string;

  @OneToOne(() => CourseSettingsEntity, {
    cascade: true,
  })
  @JoinColumn({ name: 'courseSettingsId' })
  courseSettings: CourseSettingsEntity;

  @Column({ nullable: true, comment: 'ID настроек курса' })
  courseSettingsId?: string;

  @OneToOne(() => EducationProgramSettingsEntity, {
    cascade: true,
  })
  @JoinColumn({ name: 'educationProgramSettingsId' })
  educationProgramSettings: EducationProgramSettingsEntity;

  @Column({ nullable: true, comment: 'ID настроек образовательной программы' })
  educationProgramSettingsId?: string;

  @Column({ type: 'timestamp', nullable: true, comment: 'Дата зачисления' })
  startDate?: Date;

  @Column({ type: 'timestamp', nullable: true, comment: 'Дата отчисления' })
  endDate?: Date;

  @Column({ type: 'boolean', default: true, comment: 'Обязательность' })
  isObligatory: boolean;

  @Column({
    type: 'boolean',
    default: false,
    comment: 'Признак выдачи сертификата',
  })
  certificateIssuance: boolean;

  constructor(
    ownerType: EducationRequestOwnerTypeEnum,
    educationElement: EducationElementEntity,
    user?: UserEntity,
    group?: GroupEntity,
    testSettings?: TestSettingsEntity,
    courseSettings?: CourseSettingsEntity,
    educationProgramSettings?: EducationProgramSettingsEntity,
    startDate?: string,
    endDate?: string,
    isObligatory?: boolean,
    certificateIssuance?: boolean,
  ) {
    super();
    this.ownerType = ownerType;
    this.user = user;
    this.group = group;
    this.educationElement = educationElement;
    this.testSettings = testSettings;
    this.courseSettings = courseSettings;
    this.educationProgramSettings = educationProgramSettings;
    this.startDate = getValidityDate('start', startDate);
    this.endDate = getValidityDate('end', endDate);
    this.isObligatory = isObligatory;
    this.certificateIssuance = certificateIssuance;
  }

  update(startDate?: string, endDate?: string, isObligatory?: boolean, certificateIssuance?: boolean) {
    this.startDate = getValidityDate('start', startDate);
    this.endDate = getValidityDate('end', endDate);
    this.isObligatory = isObligatory;
    this.certificateIssuance = certificateIssuance;
  }
}

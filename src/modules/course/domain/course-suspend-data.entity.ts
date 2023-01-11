import { Column, Entity } from 'typeorm';
import { BaseEntity } from '@core/domain/base.entity';

@Entity('course_suspend_data')
export class CourseSuspendDataEntity extends BaseEntity {
  @Column({
    type: 'text',
    nullable: true,
    name: 'lesson_status',
    comment: 'Статус лекции',
  })
  lessonStatus?: string;

  @Column({
    type: 'text',
    nullable: true,
    name: 'lesson_locations',
    comment: 'Раздел лекции',
  })
  lessonLocation?: string;

  @Column({
    type: 'text',
    nullable: true,
    name: 'suspend_data',
    comment: 'Хэш прогресса',
  })
  suspendData?: string;

  @Column({ type: 'text', nullable: false, comment: 'ID пользователя' })
  userId: string;

  @Column({ type: 'text', nullable: false, comment: 'ID попытки' })
  attemptId: string;

  constructor(userId: string, attemptId: string, lessonStatus?: string, lessonLocation?: string, suspendData?: string) {
    super();
    this.userId = userId;
    this.attemptId = attemptId;
    this.lessonStatus = lessonStatus;
    this.lessonLocation = lessonLocation;
    this.suspendData = suspendData;
  }

  update(lessonStatus?: string, lessonLocation?: string, suspendData?: string) {
    this.lessonStatus = lessonStatus;
    this.lessonLocation = lessonLocation;
    this.suspendData = suspendData;
  }
}

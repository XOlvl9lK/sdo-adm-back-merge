import { Column, Entity } from 'typeorm';
import { BaseEntity } from '@core/domain/base.entity';
import { getValidityDate } from '@core/libs/get-validity-date';

@Entity('course_settings')
export class CourseSettingsEntity extends BaseEntity {
  @Column({ type: 'int', default: 0, name: 'time_limit', comment: 'Продолжительность курса' })
  timeLimit: number;

  @Column({ type: 'int', default: 0, name: 'number_of_attempts', comment: 'Число попыток' })
  numberOfAttempts: number;

  @Column({ type: 'boolean', default: true, name: 'is_obligatory', comment: 'Обязательность курса' })
  isObligatory: boolean;

  @Column({ type: 'timestamp', nullable: true, name: 'start_date', comment: 'Дата начала' })
  startDate?: Date;

  @Column({ type: 'timestamp', nullable: true, name: 'end_date', comment: 'Дата завершения' })
  endDate?: Date;

  constructor(
    timeLimit?: number,
    numberOfAttempts?: number,
    isObligatory?: boolean,
    startDate?: string,
    endDate?: string,
  ) {
    super();
    this.timeLimit = timeLimit;
    this.numberOfAttempts = numberOfAttempts;
    this.isObligatory = isObligatory;
    this.startDate = getValidityDate('start', startDate);
    this.endDate = getValidityDate('end', endDate);
  }

  update(timeLimit?: number, numberOfAttempts?: number, isObligatory?: boolean, startDate?: string, endDate?: string) {
    this.timeLimit = timeLimit || 0;
    this.numberOfAttempts = numberOfAttempts || 0;
    this.isObligatory = isObligatory || false;
    this.startDate = getValidityDate('start', startDate);
    this.endDate = getValidityDate('end', endDate);
  }

  isTimeIsOver(attemptCreateDate?: Date) {
    if (!attemptCreateDate) return false;
    if (this.timeLimit === 0) return false;
    const timeSpent = new Date().getTime() - new Date(attemptCreateDate).getTime();
    return this.timeLimit * 60 * 1000 - timeSpent < 0;
  }
}

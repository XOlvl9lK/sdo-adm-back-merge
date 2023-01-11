import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { BaseEntity } from '@core/domain/base.entity';
import { UserEntity } from '@modules/user/domain/user.entity';

export enum ExportPageEnum {
  EVENT_LOG = 'EVENT_LOG',
  CONTROL_AUDIT_REGISTERED = 'CONTROL_AUDIT_REGISTERED',
  CONTROL_AUDIT_COURSE = 'CONTROL_AUDIT_COURSE',
  CONTROL_AUDIT_PROGRAM = 'CONTROL_AUDIT_PROGRAM',
  CONTROL_SESSIONS = 'CONTROL_SESSIONS',
  CONTROL_REGISTERED = 'CONTROL_REGISTERED',
  CONTROL_USER_PERFORMANCE = 'CONTROL_USER_PERFORMANCE',
  CONTROL_USER_PERIOD = 'CONTROL_USER_PERIOD',
  CONTROL_GROUP_PROGRAM = 'CONTROL_GROUP_PROGRAM',
  CONTROL_USER_PROGRAM = 'CONTROL_USER_PROGRAM',
}

export enum ExportStatusEnum {
  IN_PROCESS = 'IN_PROCESS',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR',
}

export const exportPageMap = {
  [ExportPageEnum.EVENT_LOG]: 'Журнал событий',
  [ExportPageEnum.CONTROL_AUDIT_REGISTERED]: 'Сводный аудит по успеваемости зарегистрированных пользователей',
  [ExportPageEnum.CONTROL_AUDIT_COURSE]: 'Аудит успеваемости пользователей по заданным курсам',
  [ExportPageEnum.CONTROL_AUDIT_PROGRAM]: 'Аудит успеваемости пользователей по программам обучения',
  [ExportPageEnum.CONTROL_SESSIONS]: 'Отчет по открытым сессиям пользователей',
  [ExportPageEnum.CONTROL_REGISTERED]: 'Отчет по зарегистрированным пользователям',
  [ExportPageEnum.CONTROL_USER_PERFORMANCE]: 'Отчет успеваемости пользователя',
  [ExportPageEnum.CONTROL_USER_PERIOD]: 'Отчет по обучению пользователя за период',
  [ExportPageEnum.CONTROL_GROUP_PROGRAM]: 'Отчет по обучению группы по программе обучения',
  [ExportPageEnum.CONTROL_USER_PROGRAM]: 'Отчет по обучению пользователей по программе обучения',
}

@Entity('export_task')
export class ExportTaskEntity extends BaseEntity {
  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'userId' })
  user: UserEntity

  @Column({ comment: 'ID пользователя' })
  userId: string

  @Column({ type: 'text', enum: ExportPageEnum, nullable: false, comment: 'Страница экспорта' })
  page: ExportPageEnum

  @Column({ type: 'timestamp', nullable: true, comment: 'Дата завершения задачи' })
  finishDate?: Date

  @Column({ type: 'text', enum: ExportStatusEnum, nullable: false, comment: 'Статус задачи' })
  status: ExportStatusEnum

  @Column({ type: 'text', nullable: true, comment: 'Описание ошибки' })
  errorDescription?: string

  @Column({ type: 'text', nullable: true, comment: 'Имя файла' })
  fileName?: string

  @Column({ type: 'text', nullable: true, comment: 'Ссылка на файл' })
  href?: string

  @Column({ type: 'int', nullable: false, comment: 'Прогресс создания', default: 0 })
  progress: number

  constructor(user: UserEntity, page: ExportPageEnum) {
    super();
    this.user = user
    this.page = page
    this.status = ExportStatusEnum.IN_PROCESS
  }

  update(status?: ExportStatusEnum, progress?: number) {
    if (status) this.status = status
    if (progress) this.progress = progress
  }
}
import { Column, Entity } from 'typeorm';
import { BaseEntity } from '@core/domain/base.entity';
import { MixingTypeEnum } from '@modules/education-program/domain/test-settings.entity';
import { getValidityDate } from '@core/libs/get-validity-date';

@Entity('education_program_settings')
export class EducationProgramSettingsEntity extends BaseEntity {
  @Column({ type: 'text', nullable: false, default: MixingTypeEnum.RANDOM, comment: 'Порядок изучения элементов' })
  orderOfStudy: MixingTypeEnum;

  @Column({ type: 'timestamp', nullable: true, name: 'start_date', comment: 'Дата начала' })
  startDate?: Date;

  @Column({ type: 'timestamp', nullable: true, name: 'end_date', comment: 'Дата завершения' })
  endDate?: Date;

  @Column({ type: 'boolean', nullable: true, default: true, comment: 'Обязательность' })
  isObligatory?: boolean

  constructor(orderOfStudy?: MixingTypeEnum, startDate?: string, endDate?: string, isObligatory?: boolean) {
    super();
    orderOfStudy && (this.orderOfStudy = orderOfStudy);
    this.startDate = getValidityDate('start', startDate);
    this.endDate = getValidityDate('end', endDate);
    this.isObligatory = isObligatory;
  }

  update(orderOfStudy: MixingTypeEnum, startDate?: string, endDate?: string, isObligatory?: boolean) {
    this.orderOfStudy = orderOfStudy;
    this.startDate = getValidityDate('start', startDate);
    this.endDate = getValidityDate('end', endDate);
    this.isObligatory = isObligatory
  }
}

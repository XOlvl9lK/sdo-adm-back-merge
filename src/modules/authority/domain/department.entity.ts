import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('department')
export class DepartmentEntity {
  @PrimaryColumn({ comment: 'ID cущности' })
  readonly id: string;

  @Column({ type: 'text', nullable: false, comment: 'Наименование ведомства' })
  title: string;

  constructor(title: string, foreignId: string) {
    this.title = title;
    this.id = foreignId;
  }
}

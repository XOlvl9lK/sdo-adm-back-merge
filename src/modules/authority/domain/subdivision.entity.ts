import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('subdivision')
export class SubdivisionEntity {
  @PrimaryColumn({ comment: 'ID сущности' })
  readonly id: string;

  @Column({
    type: 'text',
    nullable: false,
    comment: 'Наименование подразделения',
  })
  title: string;

  constructor(title: string, foreignId: string) {
    this.title = title;
    this.id = foreignId;
  }
}

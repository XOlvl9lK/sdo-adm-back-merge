import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('region')
export class RegionEntity {
  @PrimaryColumn({ comment: 'ID сущности' })
  readonly id: string;

  @Column({ type: 'text', nullable: false, comment: 'Наименование региона' })
  title: string;

  constructor(title: string, foreignId: string) {
    this.title = title;
    this.id = foreignId;
  }
}

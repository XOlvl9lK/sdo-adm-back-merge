import { Column, Entity, PrimaryColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity('role_dib')
export class RoleDibEntity {
  @PrimaryColumn({ comment: 'ID сущности' })
  readonly id: string;

  @Column({ type: 'text', nullable: false, comment: 'Наименование роли' })
  title: string;

  constructor(title: string, foreignId: string) {
    this.title = title;
    this.id = foreignId ? foreignId : uuidv4();
  }
}

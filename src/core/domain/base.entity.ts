import { Column, CreateDateColumn, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

export class BaseEntity {
  @PrimaryColumn({ comment: 'ID сущности' })
  readonly id: string;

  @CreateDateColumn({ comment: 'Дата создания' })
  createdAt: Date;

  @UpdateDateColumn({ comment: 'Дата обновления' })
  updatedAt: Date;

  @Column({ type: 'boolean', default: false, comment: 'Признак архивности' })
  isArchived: boolean;

  constructor() {
    this.id = uuidv4();
  }

  archive() {
    this.isArchived = true;
  }

  unzip() {
    this.isArchived = false;
  }
}

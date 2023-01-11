import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('application_settings')
export class ApplicationSettingsEntity {
  @PrimaryGeneratedColumn('uuid', { comment: 'ID сущности' })
  id: string;

  @Column({
    type: 'text',
    nullable: false,
    unique: true,
    comment: 'Название настройки',
  })
  title: string;

  @Column({ type: 'boolean', nullable: false, comment: 'Активность' })
  isActive: boolean;

  @Column({ type: 'varchar', nullable: true, comment: 'Значение' })
  value: string

  constructor(title: string, isActive: boolean) {
    this.title = title;
    this.isActive = isActive;
  }
}

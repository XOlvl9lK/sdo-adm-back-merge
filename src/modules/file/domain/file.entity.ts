import { Column, Entity } from 'typeorm';
import { BaseEntity } from '@core/domain/base.entity';

@Entity('file')
export class FileEntity extends BaseEntity {
  @Column({ type: 'text', nullable: false, comment: 'Наименование файла' })
  fileName: string;

  @Column({ type: 'text', nullable: false, comment: 'Расширение файла' })
  extension: string;

  @Column({ type: 'text', nullable: false, comment: 'MIME файла' })
  mimetype: string;

  @Column({ type: 'int', nullable: false, comment: 'Размер' })
  size: number;

  @Column({ type: 'text', nullable: true, comment: 'Хэш файла' })
  hash: string;

  @Column({
    type: 'text',
    nullable: false,
    default: 0,
    comment: 'Кол-во загрузок',
  })
  downloads: number;

  constructor(fileName: string, extension: string, mimetype: string, size: number, hash: string) {
    super();
    this.fileName = fileName;
    this.extension = extension;
    this.mimetype = mimetype;
    this.size = size;
    this.hash = hash;
  }
}

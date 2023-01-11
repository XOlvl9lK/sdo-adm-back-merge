import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { BaseEntity } from '@core/domain/base.entity';
import { UserEntity } from '@modules/user/domain/user.entity';
import { FileEntity } from '@src/modules/file/domain/file.entity';
import { ChapterEntity } from '@modules/chapter/domain/chapter.entity';

export enum InstallersEnum {
  WIN_86 = 'WIN_86',
  WIN_64 = 'WIN_64',
  LIN = 'LIN',
  META_WIN = 'META_WIN',
  META_LIN = 'MENA_LIN',
}

@Entity('library_file')
export class LibraryFileEntity extends BaseEntity {
  @Column({ type: 'text', nullable: false, comment: 'Название' })
  title: string;

  @Column({ type: 'text', nullable: true, comment: 'Описание' })
  description?: string;

  @ManyToOne(() => UserEntity, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  author: UserEntity;

  @Column({ nullable: true, comment: 'ID автора' })
  authorId: string;

  @OneToOne(() => FileEntity, {
    cascade: true,
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn()
  file: FileEntity;

  @Column({ nullable: true, comment: 'ID файла' })
  fileId: string;

  @ManyToOne(() => ChapterEntity, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  chapter: ChapterEntity;

  @Column({ nullable: true, comment: 'ID главы' })
  chapterId: string;

  @Column({ type: 'text', nullable: true, comment: 'Тип' })
  type?: InstallersEnum;

  @Column({ type: 'text', nullable: true, comment: 'Версия' })
  version?: string;

  @Column({
    type: 'timestamp',
    nullable: true,
    name: 'metadata_date',
    comment: 'Дата метаданных',
  })
  metadataDate?: string;

  @Column({
    type: 'text',
    nullable: true,
    name: 'metadata_date_string',
    comment: 'Дата метаданных (строка)',
  })
  metadataDateString?: string;

  @Column({ type: 'text', nullable: true, comment: 'Изменения' })
  changes?: string;

  @Column({ type: 'timestamp', nullable: true, comment: 'Дата версии' })
  versionDate?: Date

  constructor(
    title: string,
    author: UserEntity,
    file: FileEntity,
    chapter: ChapterEntity,
    description?: string,
    type?: InstallersEnum,
    version?: string,
    metadataDate?: string,
    changes?: string,
    versionDate?: string
  ) {
    super();
    this.title = title?.trim();
    this.author = author;
    this.file = file;
    this.chapter = chapter;
    this.description = description ? description.trim() : null;
    this.type = type;
    this.version = version;
    this.metadataDate = metadataDate;
    metadataDate && (this.metadataDateString = new Date(metadataDate).toLocaleDateString());
    this.changes = changes;
    versionDate && (this.versionDate = new Date(versionDate))
  }

  update(title: string, chapter: ChapterEntity, description?: string) {
    this.title = title.trim();
    this.chapter = chapter;
    this.description = description ? description.trim() : null;
  }
}

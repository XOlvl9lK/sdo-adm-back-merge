import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from '@core/domain/base.entity';
import { FileEntity } from '@src/modules/file/domain/file.entity';

export enum VerificationDocumentTypeEnum {
  NORMATIVE = 'NORMATIVE',
  LICENSE = 'LICENSE',
  REVOKED = 'REVOKED',
  ROOT = 'ROOT',
}

@Entity('verification_document')
export class VerificationDocumentEntity extends BaseEntity {
  @Column({ type: 'text', nullable: false, comment: 'Название' })
  title: string;

  @OneToOne(() => FileEntity, {
    cascade: true,
  })
  @JoinColumn()
  file: FileEntity;

  @Column({ nullable: true, comment: 'ID файла' })
  fileId: string;

  @Column({ type: 'text', nullable: false, comment: 'Тип документа' })
  documentType: VerificationDocumentTypeEnum;

  constructor(title: string, file: FileEntity, documentType: VerificationDocumentTypeEnum) {
    super();
    this.title = title?.trim();
    this.file = file;
    this.documentType = documentType;
  }
}

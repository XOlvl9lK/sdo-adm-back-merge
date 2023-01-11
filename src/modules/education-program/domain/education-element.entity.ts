import { Column, Entity, JoinColumn, ManyToOne, TableInheritance } from 'typeorm';
import { ContentEntity } from '@core/domain/content.entity';
import { ChapterEntity } from '@modules/chapter/domain/chapter.entity';

export enum EducationElementTypeEnum {
  COURSE = 'COURSE',
  TEST = 'TEST',
  PROGRAM = 'PROGRAM',
}

@Entity('education_element')
@TableInheritance({ column: { type: 'text', name: 'type', comment: 'Тип элемента обучения' } })
export class EducationElementEntity extends ContentEntity {
  @Column({
    type: 'text',
    default: EducationElementTypeEnum.COURSE,
    name: 'element_type',
    comment: 'Тип элемента обучения',
  })
  elementType: EducationElementTypeEnum;

  @ManyToOne(() => ChapterEntity, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'chapter_id' })
  chapter: ChapterEntity;

  @Column({ name: 'chapter_id', nullable: true, comment: 'ID главы' })
  chapterId: string;

  @Column({ type: 'boolean', default: false, comment: 'Доступность элемента обучения' })
  available: boolean;

  @Column({
    type: 'boolean',
    default: false,
    name: 'is_self_assignment_available',
    comment: 'Доступность самоназначения',
  })
  isSelfAssignmentAvailable: boolean;

  @Column({ type: 'int', default: 0, comment: 'Продолжительность элемента обучения' })
  duration?: number;

  constructor(
    title: string,
    type: EducationElementTypeEnum,
    chapter: ChapterEntity,
    description?: string,
    available?: boolean,
    isSelfAssignmentAvailable?: boolean,
  ) {
    super(title, description);
    this.elementType = type;
    this.chapter = chapter;
    this.available = available;
    this.isSelfAssignmentAvailable = isSelfAssignmentAvailable;
  }
}

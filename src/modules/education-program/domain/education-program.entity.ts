import { ChildEntity, Column, JoinTable, OneToMany } from 'typeorm';
import {
  EducationElementEntity,
  EducationElementTypeEnum,
} from '@modules/education-program/domain/education-element.entity';
import { ChapterEntity } from '@modules/chapter/domain/chapter.entity';
import { ProgramElementEntity } from '@modules/education-program/domain/program-element.entity';
import { findNextInArray } from '@core/libs/find-next-in-array';
import { ViewQuery } from '@core/libs/types';

@ChildEntity()
export class EducationProgramEntity extends EducationElementEntity {
  @OneToMany(() => ProgramElementEntity, element => element.educationProgram, {
    cascade: true,
  })
  @JoinTable()
  programElements: ProgramElementEntity[];

  @Column({ type: 'int', default: 0, comment: 'Количество элементов в программе обучения' })
  totalElements: number;

  constructor(
    title: string,
    description: string,
    available?: boolean,
    selfEnrollmentAllowed?: boolean,
    chapter?: ChapterEntity,
  ) {
    super(title, EducationElementTypeEnum.PROGRAM, chapter, description, available, selfEnrollmentAllowed);
  }

  addProgramElements(educationElement: ProgramElementEntity[]) {
    if (!this.programElements) {
      this.programElements = educationElement;
    } else {
      this.programElements.push(...educationElement);
    }
    this.totalElements = this.programElements.length;
  }

  update(
    title: string,
    description: string,
    chapter: ChapterEntity,
    selfEnrollmentAllowed: boolean,
    available: boolean,
    programElements: ProgramElementEntity[],
  ) {
    this.title = title.trim();
    this.description = description ? description.trim() : null;
    this.chapter = chapter;
    this.isSelfAssignmentAvailable = selfEnrollmentAllowed;
    this.available = available;
    this.programElements = programElements;
    this.totalElements = this.programElements.length;
  }
}

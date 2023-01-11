import { ChildEntity } from 'typeorm';
import {
  EducationElementEntity,
  EducationElementTypeEnum,
} from '@modules/education-program/domain/education-element.entity';
import { ChapterEntity } from '@modules/chapter/domain/chapter.entity';

@ChildEntity()
export class CourseEntity extends EducationElementEntity {
  constructor(
    title: string,
    selfAssignment: boolean,
    available: boolean,
    chapter: ChapterEntity,
    duration,
    description?: string,
  ) {
    super(title, EducationElementTypeEnum.COURSE, chapter, description, available, selfAssignment);
    this.duration = duration || 0;
  }

  update(
    title: string,
    duration: number,
    selfAssignment: boolean,
    available: boolean,
    chapter: ChapterEntity,
    description?: string,
  ) {
    this.title = title.trim();
    this.description = description ? description.trim() : null;
    this.duration = duration || 0;
    this.available = available;
    this.isSelfAssignmentAvailable = selfAssignment;
    this.chapter = chapter;
  }
}

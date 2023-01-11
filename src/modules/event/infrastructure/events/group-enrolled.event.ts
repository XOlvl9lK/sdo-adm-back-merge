import { EducationElementTypeEnum } from '@modules/education-program/domain/education-element.entity';

export class GroupEnrolledEvent {
  constructor(
    public educationElementId: string,
    public groupId: string,
    public educationElementType: EducationElementTypeEnum,
    public assignmentId: string,
    public userId: string,
  ) {}
}

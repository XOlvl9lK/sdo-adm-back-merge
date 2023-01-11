import { EducationElementTypeEnum } from '@modules/education-program/domain/education-element.entity';

export class UserEnrolledEvent {
  constructor(
    public educationElementId: string,
    public userId: string,
    public educationElementType: EducationElementTypeEnum,
    public assignmentId: string,
    public viewerId?: string,
  ) {}
}

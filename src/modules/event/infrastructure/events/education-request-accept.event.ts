import { EducationElementTypeEnum } from '@modules/education-program/domain/education-element.entity';

export class EducationRequestAcceptEvent {
  constructor(
    public userId: string,
    public educationRequestId: string,
    public educationElementType: EducationElementTypeEnum,
    public educationElementId: string,
    public assignmentId: string,
    public approverId: string
  ) {}
}

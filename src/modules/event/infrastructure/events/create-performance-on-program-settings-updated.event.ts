import { EducationElementTypeEnum } from '@modules/education-program/domain/education-element.entity';

export class CreatePerformanceOnProgramSettingsUpdatedEvent {
  constructor(
    public userId: string,
    public educationElementId: string,
    public educationElementType: EducationElementTypeEnum,
    public assignmentId: string,
  ) {}
}

import { EducationElementEntity } from '@modules/education-program/domain/education-element.entity';

export class ObligatoryUpdatedEvent {
  constructor(
    public roleDibId: string,
    public addedEducationElements: EducationElementEntity[],
    public isObligatory: boolean,
  ) {}
}

export enum GroupChangesTypeEnum {
  ADD,
  REMOVE
}

export class GroupChangesEvent {
  constructor(
    public type: GroupChangesTypeEnum,
    public groupId: string,
    public userIds: string[]
  ) {}
}
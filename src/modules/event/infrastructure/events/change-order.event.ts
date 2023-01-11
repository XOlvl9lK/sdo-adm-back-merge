export class ChangeOrderEvent {
  constructor(
    public userId: string,
    public parentEntityId: string,
    public parentEntityName: string,
    public page: string,
    public childEntityDesc?: string,
  ) {}
}

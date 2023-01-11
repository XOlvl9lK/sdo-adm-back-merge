export class CreateEntityEvent {
  constructor(public entityName: string, public userId: string, public entityId: string, public page: string) {}
}

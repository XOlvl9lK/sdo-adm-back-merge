export class UpdateEntityEvent {
  constructor(
    public entityName: string,
    public userId: string,
    public page: string,
    public newEntity: {
      [key: string]: any;
    },
  ) {}
}

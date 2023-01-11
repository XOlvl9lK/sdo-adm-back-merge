export class ForumMessageCreatedEvent {
  constructor(public messageId: string, public themeId: string) {}
}

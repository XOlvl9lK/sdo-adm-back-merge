export enum ThemeActionEnum {
  OPEN = 'открыл',
  CLOSE = 'закрыл',
  FIX = 'закрепил',
  UNPIN = 'открепил',
}

export class UpdateForumThemeEvent {
  constructor(public userId: string, public action: ThemeActionEnum, public themeId: string) {}
}

export class UpdateForumMessageDto {
  id: string;
  content: string;
}

export class MoveForumMessageDto {
  id: string;
  themeIdTo: string;
  setFirst: boolean;
}

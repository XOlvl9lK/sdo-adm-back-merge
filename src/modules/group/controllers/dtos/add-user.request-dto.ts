import { IsArray, IsString } from 'class-validator';

export class AddUserRequestDto {
  @IsString({ message: 'Должно быть строкой' })
  groupId: string;

  @IsString({ message: 'Должно быть строкой' })
  userId: string;
}

export class AddUsersRequestDto {
  @IsString({ message: 'Должно быть строкой' })
  groupId: string;

  @IsArray({ message: 'Должно быть массивом' })
  @IsString({ each: true, message: 'Должно быть строкой' })
  userIds: string[];
}

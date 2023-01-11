import { IsArray, IsString } from 'class-validator';

export class MoveUsersRequestDto {
  @IsString({ message: 'Должно быть строкой' })
  groupIdFrom: string;

  @IsString({ message: 'Должно быть строкой' })
  groupIdTo: string;

  @IsArray({ message: 'Должно быть массивом' })
  @IsString({ each: true, message: 'Должно быть строкой' })
  userIds: string[];
}

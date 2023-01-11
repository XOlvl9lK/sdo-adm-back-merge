import { IsArray, IsString } from 'class-validator';

export class UpdateGroupDtoRequest {
  @IsString({ message: 'Должно быть строкой' })
  groupId: string;

  @IsString({ message: 'Должно быть строкой' })
  title: string;

  @IsString({ message: 'Должно быть строкой' })
  description: string;
}

import { IsString } from 'class-validator';

export class CreateGroupRequestDto {
  @IsString({ message: 'Должно быть строкой' })
  title: string;

  @IsString({ message: 'Должно быть строкой' })
  description: string;
}

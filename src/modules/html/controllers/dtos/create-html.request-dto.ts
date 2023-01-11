import { IsString } from 'class-validator';

export class CreateHtmlRequestDto {
  @IsString({ message: 'Должно быть строкой' })
  content: string;

  description?: string;
}

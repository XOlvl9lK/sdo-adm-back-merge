import { IsString } from 'class-validator';

export class CreateChapterDto {
  @IsString({ message: 'Дожно быть строкой' })
  title: string;
  description?: string;
}

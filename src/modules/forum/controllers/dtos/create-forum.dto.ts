import { IsOptional, IsString } from 'class-validator';

export class CreateForumDto {
  @IsString({ message: 'Должно быть строкой' })
  title: string;

  @IsOptional()
  @IsString({ message: 'Должно быть строкой' })
  description?: string;
}

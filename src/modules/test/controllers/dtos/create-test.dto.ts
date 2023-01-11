import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { ChapterModeEnum } from '@modules/course/controllers/dtos/create-course.dto';

export class CreateTestDto {
  @IsString({ message: 'Название должно быть строкой' })
  title: string;

  @IsNumber({ allowNaN: false, allowInfinity: false }, { message: 'Продолжительность должна быть числом' })
  duration: number;

  @IsOptional()
  @IsNumber({ allowNaN: false, allowInfinity: false }, { message: 'Должно быть числом' })
  threshold?: number;

  @IsOptional()
  @IsString({ message: 'Название должно быть строкой' })
  description?: string;

  @IsString({ message: 'Название должно быть строкой' })
  chapterId: string;

  @IsEnum(ChapterModeEnum)
  sectionMode: ChapterModeEnum;

  @IsString()
  @IsOptional()
  chapterCreateTitle?: string;
}

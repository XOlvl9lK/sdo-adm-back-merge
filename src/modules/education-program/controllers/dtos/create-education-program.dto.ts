import { IsArray, IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { ChapterModeEnum } from '@modules/course/controllers/dtos/create-course.dto';

export class CreateEducationProgramDto {
  @IsString({ message: 'Должно быть строкой' })
  title: string;

  @IsString({ message: 'Должно быть строкой' })
  description: string;

  @IsArray({ message: 'Должно быть массивом' })
  educationElementIds: string[];

  @IsOptional()
  @IsBoolean({ message: 'Должно быть логическим значением' })
  available?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'Должно быть логическим значением' })
  selfAssignment?: boolean;

  @IsString({ message: 'Должно быть строкой' })
  chapterId: string;

  @IsString()
  @IsOptional()
  chapterCreateTitle?: string;

  @IsEnum(ChapterModeEnum)
  sectionMode: ChapterModeEnum;
}

import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { ChapterModeEnum } from '@modules/course/controllers/dtos/create-course.dto';

export class UpdateCourseDto {
  @IsString()
  id: string;

  @IsString()
  chapterId: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  duration: number;

  @IsBoolean()
  available: boolean;

  @IsBoolean()
  selfAssignment: boolean;

  @IsString()
  @IsOptional()
  chapterCreateTitle?: string;

  @IsEnum(ChapterModeEnum)
  sectionMode: ChapterModeEnum;
}

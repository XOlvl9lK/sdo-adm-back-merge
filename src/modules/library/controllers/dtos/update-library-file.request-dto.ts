import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ChapterModeEnum } from '@modules/course/controllers/dtos/create-course.dto';

export class UpdateLibraryFileRequestDto {
  @IsString({ message: 'Должно быть строкой' })
  libraryFileId: string;

  @IsString({ message: 'Должно быть строкой' })
  title: string;

  @IsOptional()
  @IsString({ message: 'Должно быть строкой' })
  description?: string;

  @IsString({ message: 'Должно быть строкой' })
  chapterId: string;

  @IsEnum(ChapterModeEnum)
  sectionMode: ChapterModeEnum;

  @IsString()
  @IsOptional()
  chapterCreateTitle?: string;
}

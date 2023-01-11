import { IsEnum, IsOptional, IsString } from 'class-validator';
import { InstallersEnum } from '@modules/library/domain/library-file.entity';
import { ChapterModeEnum } from '@modules/course/controllers/dtos/create-course.dto';

export class CreateLibraryFileRequestDto {
  @IsString({ message: 'Должно быть строкой' })
  title: string;

  @IsString({ message: 'Должно быть строкой' })
  authorId: string;

  @IsString({ message: 'Должно быть строкой' })
  chapterId: string;

  @IsString()
  @IsOptional()
  chapterCreateTitle?: string;

  @IsOptional()
  @IsString({ message: 'Должно быть строкой' })
  description?: string;

  @IsEnum(ChapterModeEnum)
  sectionMode: ChapterModeEnum;

  type?: InstallersEnum;

  version?: string;

  metadataDate?: string;

  changes?: string;

  versionDate?: string
}

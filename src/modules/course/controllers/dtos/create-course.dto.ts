import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';

export enum ChapterModeEnum {
  CREATE = 'CREATE',
  CHOSE = 'CHOSE',
}

export class CreateCourseDto {
  @IsString({ message: 'Должно быть строкой' })
  title: string;

  @IsString({ message: 'Должно быть строкой' })
  chapterId: string;

  @IsOptional()
  @IsString({ message: 'Должно быть строкой' })
  description: string;

  @IsNumber({ allowNaN: false, allowInfinity: false }, { message: 'Должно быть строкой' })
  duration: number;

  @IsBoolean()
  selfAssignment: boolean;

  @IsBoolean()
  available: boolean;

  @IsString()
  @IsOptional()
  chapterCreateTitle?: string;

  @IsEnum(ChapterModeEnum)
  sectionMode: ChapterModeEnum;
}

import { IsArray, IsString } from 'class-validator';

export class AddQuestionsToThemeDto {
  @IsString({ message: 'Должно быть строкой' })
  themeIdTo: string;

  @IsArray({ message: 'Должно быть массивом' })
  @IsString({ each: true, message: 'Должно быть строкой' })
  questionIds: string[];
}

export class MoveQuestionsDto {
  @IsString({ message: 'Должно быть строкой' })
  themeIdTo: string;

  @IsArray({ message: 'Должно быть массивом' })
  @IsString({ each: true, message: 'Должно быть строкой' })
  questionInThemeIds: string[];
}

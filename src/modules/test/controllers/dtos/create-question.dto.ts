import { TestQuestionTypesEnum } from '@modules/test/domain/test-question.entity';
import { CreateAnswerDto } from '@modules/test/controllers/dtos/create-answer.dto';
import { IsArray, IsEnum, IsString, ValidateNested } from 'class-validator';

export class CreateQuestionDto {
  @IsString({ message: 'Название должно быть строкой' })
  title: string;

  @IsEnum(TestQuestionTypesEnum, { message: 'Должено быть одним из значений TestQuestionTypesEnum' })
  type: TestQuestionTypesEnum;

  @IsArray({ message: 'Должно быть массивом' })
  @ValidateNested()
  answers: CreateAnswerDto[];

  @IsString({ message: 'Должно быть строкой' })
  testThemeId: string;

  @IsString({ message: 'Должно быть строкой' })
  authorId: string;
}

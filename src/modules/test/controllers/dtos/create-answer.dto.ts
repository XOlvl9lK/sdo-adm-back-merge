import { AnswerTypesEnum } from '@modules/test/domain/answer.entity';
import { IsBoolean, IsEnum, IsNumber, IsString, ValidateIf } from 'class-validator';
import { TestQuestionTypesEnum } from '@modules/test/domain/test-question.entity';

export class CreateAnswerDto {
  @IsString({ message: 'Должно быть строкой' })
  value: string;

  @IsEnum(AnswerTypesEnum, { message: 'Должно быть одним из значений AnswerTypesEnum' })
  type: TestQuestionTypesEnum;

  @ValidateIf(o => o.type === TestQuestionTypesEnum.SINGLE || o.type === TestQuestionTypesEnum.MULTIPLE)
  @IsBoolean({ message: 'Должно быть boolean' })
  isCorrect: boolean;

  @ValidateIf(o => o.type === TestQuestionTypesEnum.ASSOCIATIVE)
  @IsString({ message: 'Должно быть строкой' })
  definition: string;

  @ValidateIf(o => o.type === TestQuestionTypesEnum.ORDERED)
  @IsNumber({ allowInfinity: false, allowNaN: false }, { message: 'Должно быть числом' })
  order: number;

  @ValidateIf(o => o.type === TestQuestionTypesEnum.OPEN)
  @IsNumber({}, { message: 'Должно быть числом' })
  mistakesAllowed: number;

  @ValidateIf(o => o.type === TestQuestionTypesEnum.OPEN)
  @IsString({ message: 'Должно быть строкой' })
  correctAnswer: string;
}

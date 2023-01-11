import { IsArray, IsBoolean, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

export class SubmitAnswerDto {
  @IsString({ message: 'Должно быть строкой' })
  answerId: string;

  @IsOptional()
  @IsBoolean({ message: 'Должно быть true или false' })
  isCorrect?: boolean;

  @IsOptional()
  @IsString({ message: 'Должно быть строкой' })
  definition?: string;

  @IsOptional()
  @IsNumber({ allowNaN: false, allowInfinity: false }, { message: 'Должно быть числом' })
  order?: number;

  @IsOptional()
  @IsString({ message: 'Должно быть строкой' })
  correctAnswer: string;
}

export class SubmitQuestionDto {
  @IsString({ message: 'Должно быть строкой' })
  testId: string;

  @IsString({ message: 'Должно быть строкой' })
  questionId: string;

  @IsString({ message: 'Должно быть строкой' })
  questionInThemeId: string;

  @IsString({ message: 'Должно быть строкой' })
  performanceId: string;

  @IsArray()
  @ValidateNested()
  submittedAnswers: SubmitAnswerDto[];
}

export class SubmitManyQuestionDto {
  submittedQuestions: SubmitQuestionDto[];
}

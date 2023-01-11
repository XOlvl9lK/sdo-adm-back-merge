import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import {
  MixingTypeEnum,
  QuestionDeliveryFormatEnum,
  QuestionSelectionTypeEnum,
} from '@modules/education-program/domain/test-settings.entity';

export class CreateTestSettingsDto {
  @IsOptional()
  @IsNumber({}, { message: 'Должно быть числом' })
  timeLimit?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Должно быть числом' })
  numberOfAttempts?: number;

  @IsOptional()
  @IsEnum(QuestionDeliveryFormatEnum, {
    message: 'Должно быть одним из значений QuestionDeliveryFormatEnum',
  })
  questionDeliveryFormat?: QuestionDeliveryFormatEnum;

  @IsOptional()
  @IsEnum(QuestionSelectionTypeEnum, {
    message: 'Должно быть одним из значений QuestionSelectionTypeEnum',
  })
  questionSelectionType?: QuestionSelectionTypeEnum;

  @IsOptional()
  @IsEnum(MixingTypeEnum, {
    message: 'Должно быть одним из значений MixingTypeEnum',
  })
  questionMixingType?: MixingTypeEnum;

  @IsOptional()
  @IsEnum(MixingTypeEnum, {
    message: 'Должно быть одним из значений MixingTypeEnum',
  })
  answerMixingType?: MixingTypeEnum;

  @IsOptional()
  @IsBoolean({ message: 'Должно быть логическим значением' })
  isCorrectAnswersAvailable?: boolean;

  @IsOptional()
  @IsString({ message: 'Должно быть строкой' })
  correctAnswersAvailableDate?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Должно быть числом' })
  maxScore?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Должно быть числом' })
  passingScore?: number;

  @IsOptional()
  @IsBoolean({ message: 'Должно быть логическим значением' })
  isObligatory?: boolean;

  @IsOptional()
  @IsString({ message: 'Должно быть строкой' })
  startDate?: string;

  @IsOptional()
  @IsString({ message: 'Должно быть строкой' })
  endDate?: string;
}

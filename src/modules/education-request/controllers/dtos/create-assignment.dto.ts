import { IsArray, IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator';
import { EducationRequestOwnerTypeEnum } from '@modules/education-request/domain/education-request.entity';
import { EducationElementTypeEnum } from '@modules/education-program/domain/education-element.entity';
import {
  MixingTypeEnum,
  QuestionDeliveryFormatEnum,
  QuestionSelectionTypeEnum,
} from '@modules/education-program/domain/test-settings.entity';

export class CreateAssignmentDto {
  @IsEnum(EducationRequestOwnerTypeEnum, {
    message: 'Должно быть одним из значений EducationRequestOwnerTypeEnum',
  })
  ownerType: EducationRequestOwnerTypeEnum;

  @IsOptional()
  @IsString({ message: 'Должно быть строкой' })
  userId?: string;

  @IsOptional()
  @IsString({ message: 'Должно быть строкой' })
  groupId?: string;

  @IsString({ message: 'Должно быть строкой' })
  educationElementId: string;

  validityFrom?: string;
  validityTo?: string;
  isObligatory?: boolean;
  certificateIssuance?: boolean;

  testSettings?: {
    timeLimit: number;
    numberOfAttempts: number;
    questionDeliveryFormat: QuestionDeliveryFormatEnum;
    questionSelectionType: QuestionSelectionTypeEnum;
    questionMixingType: MixingTypeEnum;
    answerMixingType: MixingTypeEnum;
    isCorrectAnswersAvailable: boolean;
    maxScore: number;
    passingScore: number;
  };
  courseSettings?: {
    timeLimit: number;
    numberOfAttempts: number;
  };
  programSettings?: {
    orderOfStudy: MixingTypeEnum;
  };
}

export class EnrollManyDto {
  @IsArray({ message: 'Должно быть массивом' })
  @ValidateNested()
  owners: EnrollManyOwnerDto[];

  @IsArray({ message: 'Должно быть массивом' })
  @ValidateNested()
  educationElementIds: EnrollManyEducationElementDto[];

  validityFrom?: string;
  validityTo?: string;
  certificateIssuance?: boolean;
  testSettings: {
    timeLimit: number;
    numberOfAttempts: number;
    questionDeliveryFormat: QuestionDeliveryFormatEnum;
    questionSelectionType: QuestionSelectionTypeEnum;
    questionMixingType: MixingTypeEnum;
    answerMixingType: MixingTypeEnum;
    isCorrectAnswersAvailable: boolean;
    maxScore: number;
    passingScore: number;
  };
  courseSettings: {
    timeLimit: number;
    numberOfAttempts: number;
  };
  programSettings: {
    orderOfStudy: MixingTypeEnum;
  };
}

export class EnrollManyOwnerDto {
  @IsEnum(EducationRequestOwnerTypeEnum, {
    message: 'Должно быть одним из значений EducationRequestOwnerTypeEnum',
  })
  ownerType: EducationRequestOwnerTypeEnum;

  @IsString({ message: 'Должно быть строкой' })
  id: string;
}

export class EnrollManyEducationElementDto {
  @IsString({ message: 'Должно быть строкой' })
  educationElementId: string;

  @IsString({ message: 'Должно быть строкой' })
  elementType: EducationElementTypeEnum;
}

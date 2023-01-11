import {
  MixingTypeEnum,
  QuestionDeliveryFormatEnum,
  QuestionSelectionTypeEnum,
} from '@modules/education-program/domain/test-settings.entity';

export class RunTestAttemptDto {
  questionDeliveryFormat: QuestionDeliveryFormatEnum;
  questionSelectionType: QuestionSelectionTypeEnum;
  questionMixingType: MixingTypeEnum;
  answerMixingType: MixingTypeEnum;
}

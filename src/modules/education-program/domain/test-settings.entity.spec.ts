import { mockBaseEntity } from '@core/domain/base.entity.mock';
import { Random } from '@core/test/random';
import {
  MixingTypeEnum,
  QuestionDeliveryFormatEnum,
  QuestionSelectionTypeEnum,
  TestSettingsEntity,
} from '@modules/education-program/domain/test-settings.entity';
import { plainToInstance } from 'class-transformer';

const mockTestSettings = {
  ...mockBaseEntity,
  timeLimit: Random.number,
  numberOfAttempts: 5,
  questionDeliveryFormat: QuestionDeliveryFormatEnum.ALL,
  questionSelectionType: QuestionSelectionTypeEnum.NEW,
  questionMixingType: MixingTypeEnum.RANDOM,
  answerMixingType: MixingTypeEnum.RANDOM,
  isCorrectAnswersAvailable: true,
  correctAnswersAvailableDate: Random.datePast,
  maxScore: 100,
  passingScore: 75,
  startDate: Random.datePast,
  endDate: Random.datePast,
};

export const mockTestSettingsInstance = plainToInstance(TestSettingsEntity, mockTestSettings);

describe('TestSettingsEntity', () => {
  test('Should update', () => {
    mockTestSettingsInstance.update(
      30,
      11,
      QuestionDeliveryFormatEnum.LIMIT,
      QuestionSelectionTypeEnum.SINGLE,
      MixingTypeEnum.ORIGINAL,
      MixingTypeEnum.ORIGINAL,
      false,
      150,
      80,
      false,
    );

    expect(mockTestSettingsInstance.timeLimit).toBe(30);
    expect(mockTestSettingsInstance.numberOfAttempts).toBe(11);
    expect(mockTestSettingsInstance.questionDeliveryFormat).toBe(QuestionDeliveryFormatEnum.LIMIT);
    expect(mockTestSettingsInstance.questionSelectionType).toBe(QuestionSelectionTypeEnum.SINGLE);
    expect(mockTestSettingsInstance.questionMixingType).toBe(MixingTypeEnum.ORIGINAL);
    expect(mockTestSettingsInstance.answerMixingType).toBe(MixingTypeEnum.ORIGINAL);
    expect(mockTestSettingsInstance.isCorrectAnswersAvailable).toBe(false);
    expect(mockTestSettingsInstance.maxScore).toBe(150);
    expect(mockTestSettingsInstance.passingScore).toBe(80);
    expect(mockTestSettingsInstance.isObligatory).toBe(false);
  });
});

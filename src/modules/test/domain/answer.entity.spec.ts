import { mockBaseEntity } from '@core/domain/base.entity.mock';
import { Random } from '@core/test/random';
import { TestQuestionTypesEnum } from '@modules/test/domain/test-question.entity';
import { plainToInstance } from 'class-transformer';
import {
  AssociativeAnswerEntity,
  MultipleAnswerEntity,
  OpenAnswerEntity,
  OrderedAnswerEntity,
  SingleAnswerEntity,
} from '@modules/test/domain/answer.entity';

const mockSingleAnswer = {
  ...mockBaseEntity,
  value: Random.lorem,
  type: TestQuestionTypesEnum.SINGLE,
  isCorrect: Random.boolean,
};

export const mockSingleAnswerInstance = plainToInstance(SingleAnswerEntity, mockSingleAnswer);

const mockMultipleAnswer = {
  ...mockBaseEntity,
  value: Random.lorem,
  type: TestQuestionTypesEnum.MULTIPLE,
  isCorrect: Random.boolean,
};

export const mockMultipleAnswerInstance = plainToInstance(MultipleAnswerEntity, mockMultipleAnswer);

const mockAssociativeAnswer = {
  ...mockBaseEntity,
  value: Random.lorem,
  type: TestQuestionTypesEnum.ASSOCIATIVE,
  definition: Random.lorem,
};

export const mockAssociativeAnswerInstance = plainToInstance(AssociativeAnswerEntity, mockAssociativeAnswer);

const mockOpenAnswer = {
  ...mockBaseEntity,
  value: Random.lorem,
  type: TestQuestionTypesEnum.OPEN,
  correctAnswer: Random.lorem,
  mistakesAllowed: Random.number,
};

export const mockOpenAnswerInstance = plainToInstance(OpenAnswerEntity, mockOpenAnswer);

const mockOrderedAnswer = {
  ...mockBaseEntity,
  value: Random.lorem,
  type: TestQuestionTypesEnum.ORDERED,
  order: Random.number,
};

export const mockOrderedAnswerInstance = plainToInstance(OrderedAnswerEntity, mockOrderedAnswer);

describe('AnswerEntity', () => {
  test('singleAnswer.isCorrect should return correct value', () => {
    const result = mockSingleAnswerInstance.isAnswerCorrect();

    expect(result).toBe(Random.boolean);
  });

  test('multipleAnswer.isCorrect should return correct value', () => {
    const result = mockMultipleAnswerInstance.isAnswerCorrect();

    expect(result).toBe(Random.boolean);
  });

  test('associativeAnswer.isCorrect should return correct value', () => {
    const result = mockAssociativeAnswerInstance.isAnswerCorrect(Random.lorem);

    expect(result).toBe(true);
  });

  test('openAnswer.isCorrect should return correct value', () => {
    const result = mockOpenAnswerInstance.isAnswerCorrect(Random.lorem);

    expect(result).toBe(true);
  });

  test('orderedAnswer.isCorrect should return correct value', () => {
    const result = mockOrderedAnswerInstance.isAnswerCorrect(Random.number);

    expect(result).toBe(true);
  });
});

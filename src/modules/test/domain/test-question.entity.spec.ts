import { mockBaseEntity } from '@core/domain/base.entity.mock';
import { Random } from '@core/test/random';
import { TestQuestionEntity, TestQuestionTypesEnum } from '@modules/test/domain/test-question.entity';
import {
  mockAssociativeAnswerInstance,
  mockMultipleAnswerInstance,
  mockOpenAnswerInstance,
  mockOrderedAnswerInstance,
  mockSingleAnswerInstance,
} from '@modules/test/domain/answer.entity.spec';
import { mockUserInstance } from '@modules/user/domain/user.entity.spec';
import { plainToInstance } from 'class-transformer';
import {
  mockAssociativeAnswerAttemptInstance,
  mockMultipleAnswerAttemptInstance,
  mockOpenAnswerAttemptInstance,
  mockOrderedAnswerAttemptInstance,
  mockSingleAnswerAttemptInstance,
} from '@modules/performance/domain/attempt.entity.spec';

const mockSingleTestQuestion = {
  ...mockBaseEntity,
  title: Random.lorem,
  type: TestQuestionTypesEnum.SINGLE,
  answers: [mockSingleAnswerInstance],
  author: mockUserInstance,
};

export const mockSingleTestQuestionInstance = plainToInstance(TestQuestionEntity, mockSingleTestQuestion, {
  enableCircularCheck: true,
});

const mockMultipleTestQuestion = {
  ...mockBaseEntity,
  title: Random.lorem,
  type: TestQuestionTypesEnum.MULTIPLE,
  answers: [mockMultipleAnswerInstance],
  author: mockUserInstance,
};

export const mockMultipleTestQuestionInstance = plainToInstance(TestQuestionEntity, mockMultipleTestQuestion, {
  enableCircularCheck: true,
});

const mockAssociativeTestQuestion = {
  ...mockBaseEntity,
  title: Random.lorem,
  type: TestQuestionTypesEnum.ASSOCIATIVE,
  answers: [mockAssociativeAnswerInstance],
  author: mockUserInstance,
};

export const mockAssociativeTestQuestionInstance = plainToInstance(TestQuestionEntity, mockAssociativeTestQuestion, {
  enableCircularCheck: true,
});

const mockOpenTestQuestion = {
  ...mockBaseEntity,
  title: Random.lorem,
  type: TestQuestionTypesEnum.OPEN,
  answers: [mockOpenAnswerInstance],
  author: mockUserInstance,
};

export const mockOpenTestQuestionInstance = plainToInstance(TestQuestionEntity, mockOpenTestQuestion, {
  enableCircularCheck: true,
});

const mockOrderedTestQuestion = {
  ...mockBaseEntity,
  title: Random.lorem,
  type: TestQuestionTypesEnum.ORDERED,
  answers: [mockOrderedAnswerInstance],
  author: mockUserInstance,
};

export const mockOrderedTestQuestionInstance = plainToInstance(TestQuestionEntity, mockOrderedTestQuestion, {
  enableCircularCheck: true,
});

describe('TestQuestionEntity', () => {
  test('Should check single answer', () => {
    const result = mockSingleTestQuestionInstance.checkSingleAnswer(mockSingleAnswerAttemptInstance);

    expect(result).toBe(Random.boolean);
  });

  test('Should check multiple answer', () => {
    const result = mockMultipleTestQuestionInstance.checkMultipleAnswer([mockMultipleAnswerAttemptInstance]);

    expect(result).toBe(Random.boolean);
  });

  test('Should check open answer', () => {
    const result = mockOpenTestQuestionInstance.checkOpenAnswer(mockOpenAnswerAttemptInstance);

    expect(result).toBe(true);
  });

  test('Should check ordered answer', () => {
    const result = mockOrderedTestQuestionInstance.checkOrderedAnswer([mockOrderedAnswerAttemptInstance]);

    expect(result).toBe(true);
  });

  test('Should check associative answer', () => {
    const result = mockAssociativeTestQuestionInstance.checkAssociativeAnswer([mockAssociativeAnswerAttemptInstance]);

    expect(result).toBe(true);
  });
});

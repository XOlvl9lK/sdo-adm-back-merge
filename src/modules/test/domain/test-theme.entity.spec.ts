import {
  mockAssociativeTestQuestionInstance,
  mockMultipleTestQuestionInstance,
  mockOpenTestQuestionInstance,
  mockOrderedTestQuestionInstance,
  mockSingleTestQuestionInstance,
} from '@modules/test/domain/test-question.entity.spec';
import { mockBaseEntity } from '@core/domain/base.entity.mock';
import { Random } from '@core/test/random';
import { plainToInstance } from 'class-transformer';
import { QuestionInThemeEntity, TestThemeEntity } from '@modules/test/domain/test-theme.entity';
import { TestQuestionEntity, TestQuestionTypesEnum } from '@modules/test/domain/test-question.entity';
import {
  mockAssociativeAnswerInstance,
  mockMultipleAnswerInstance,
  mockOpenAnswerInstance,
  mockOrderedAnswerInstance,
  mockSingleAnswerInstance,
} from '@modules/test/domain/answer.entity.spec';
import { mockUserInstance } from '@modules/user/domain/user.entity.spec';

const theme = plainToInstance(TestThemeEntity, {
  ...mockBaseEntity,
  title: Random.lorem,
  description: Random.lorem,
  questions: [],
});

const mockSingleQuestionInTheme = {
  ...mockBaseEntity,
  theme,
  question: plainToInstance(TestQuestionEntity, {
    ...mockBaseEntity,
    title: Random.lorem,
    type: TestQuestionTypesEnum.SINGLE,
    answers: [mockSingleAnswerInstance],
    author: mockUserInstance,
  }),
  order: 1,
};

export const mockSingleQuestionInThemeInstance = plainToInstance(QuestionInThemeEntity, mockSingleQuestionInTheme, {
  enableCircularCheck: true,
});

const mockMultipleQuestionInTheme = {
  ...mockBaseEntity,
  theme,
  question: plainToInstance(TestQuestionEntity, {
    ...mockBaseEntity,
    title: Random.lorem,
    type: TestQuestionTypesEnum.MULTIPLE,
    answers: [mockMultipleAnswerInstance],
    author: mockUserInstance,
  }),
  order: 2,
};

export const mockMultipleQuestionInThemeInstance = plainToInstance(QuestionInThemeEntity, mockMultipleQuestionInTheme, {
  enableCircularCheck: true,
});

const mockOpenQuestionInTheme = {
  ...mockBaseEntity,
  theme,
  question: plainToInstance(TestQuestionEntity, {
    ...mockBaseEntity,
    title: Random.lorem,
    type: TestQuestionTypesEnum.OPEN,
    answers: [mockOpenAnswerInstance],
    author: mockUserInstance,
  }),
  order: 3,
};

export const mockOpenQuestionInThemeInstance = plainToInstance(QuestionInThemeEntity, mockOpenQuestionInTheme, {
  enableCircularCheck: true,
});

const mockAssociativeQuestionInTheme = {
  ...mockBaseEntity,
  theme,
  question: plainToInstance(TestQuestionEntity, {
    ...mockBaseEntity,
    title: Random.lorem,
    type: TestQuestionTypesEnum.ASSOCIATIVE,
    answers: [mockAssociativeAnswerInstance],
    author: mockUserInstance,
  }),
  order: 4,
};

export const mockAssociativeQuestionInThemeInstance = plainToInstance(
  QuestionInThemeEntity,
  mockAssociativeQuestionInTheme,
  {
    enableCircularCheck: true,
  },
);

const mockOrderedQuestionInTheme = {
  ...mockBaseEntity,
  theme,
  question: plainToInstance(TestQuestionEntity, {
    ...mockBaseEntity,
    title: Random.lorem,
    type: TestQuestionTypesEnum.ORDERED,
    answers: [mockOrderedAnswerInstance],
    author: mockUserInstance,
  }),
  order: 5,
};

export const mockOrderedQuestionInThemeInstance = plainToInstance(QuestionInThemeEntity, mockOrderedQuestionInTheme, {
  enableCircularCheck: true,
});

const mockTestTheme = {
  ...mockBaseEntity,
  title: Random.lorem,
  description: Random.lorem,
  questionsToDisplay: Random.number,
  totalQuestions: 5,
  questions: [
    mockSingleQuestionInThemeInstance,
    mockMultipleQuestionInThemeInstance,
    mockOpenQuestionInThemeInstance,
    mockAssociativeQuestionInThemeInstance,
    mockOrderedQuestionInThemeInstance,
  ],
};

export const mockTestThemeInstance = plainToInstance(TestThemeEntity, mockTestTheme, {
  enableCircularCheck: true,
});

describe('TestThemeEntity', () => {
  test('Should update test theme', () => {
    mockTestThemeInstance.update('Title', 'Description', 10);

    expect(mockTestThemeInstance.title).toBe('Title');
    expect(mockTestThemeInstance.description).toBe('Description');
    expect(mockTestThemeInstance.questionsToDisplay).toBe(10);
  });
});

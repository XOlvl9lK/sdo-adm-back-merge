import { mockBaseEntity } from '@core/domain/base.entity.mock';
import {
  mockAssociativeAnswerInstance,
  mockMultipleAnswerInstance,
  mockOpenAnswerInstance,
  mockOrderedAnswerInstance,
  mockSingleAnswerInstance,
} from '@modules/test/domain/answer.entity.spec';
import { Random } from '@core/test/random';
import { plainToInstance } from 'class-transformer';
import {
  AnswerAttemptEntity,
  CourseAttemptEntity,
  TestAttemptEntity,
  TestQuestionAttemptEntity,
} from '@modules/performance/domain/attempt.entity';
import { mockUserInstance } from '@modules/user/domain/user.entity.spec';
import { PerformanceStatusEnum } from '@modules/performance/domain/performance.entity';
import { mockTestInstance } from '@modules/test/domain/test.entity.spec';
import { TestQuestionEntity, TestQuestionTypesEnum } from '@modules/test/domain/test-question.entity';
import { mockCourseInstance } from '@modules/course/domain/course.entity.spec';

const mockSingleAnswerAttempt = {
  ...mockBaseEntity,
  answer: mockSingleAnswerInstance,
  answerId: Random.id,
  isCorrect: Random.boolean,
};

export const mockSingleAnswerAttemptInstance = plainToInstance(AnswerAttemptEntity, mockSingleAnswerAttempt);

const mockMultipleAnswerAttempt = {
  ...mockBaseEntity,
  answer: mockMultipleAnswerInstance,
  answerId: Random.id,
  isCorrect: Random.boolean,
};

export const mockMultipleAnswerAttemptInstance = plainToInstance(AnswerAttemptEntity, mockMultipleAnswerAttempt);

const mockAssociativeAnswerAttempt = {
  ...mockBaseEntity,
  answer: mockAssociativeAnswerInstance,
  answerId: Random.id,
  definition: Random.lorem,
};

export const mockAssociativeAnswerAttemptInstance = plainToInstance(AnswerAttemptEntity, mockAssociativeAnswerAttempt);

const mockOpenAnswerAttempt = {
  ...mockBaseEntity,
  answer: mockOpenAnswerInstance,
  answerId: Random.id,
  correctAnswer: Random.lorem,
};

export const mockOpenAnswerAttemptInstance = plainToInstance(AnswerAttemptEntity, mockOpenAnswerAttempt);

const mockOrderedAnswerAttempt = {
  ...mockBaseEntity,
  answer: mockOrderedAnswerInstance,
  answerId: Random.id,
  order: Random.number,
};

export const mockOrderedAnswerAttemptInstance = plainToInstance(AnswerAttemptEntity, mockOrderedAnswerAttempt);

const mockSingleTestQuestionAttempt = {
  ...mockBaseEntity,
  question: plainToInstance(TestQuestionEntity, {
    ...mockBaseEntity,
    title: Random.lorem,
    type: TestQuestionTypesEnum.SINGLE,
    answers: [mockSingleAnswerInstance],
    author: mockUserInstance,
  }),
  questionId: Random.id,
  answerAttempts: [mockSingleAnswerAttemptInstance],
  themeId: Random.id,
};

export const mockSingleTestQuestionAttemptInstance = plainToInstance(
  TestQuestionAttemptEntity,
  mockSingleTestQuestionAttempt,
);

const mockTestAttempt = {
  ...mockBaseEntity,
  timeSpent: '00:20:00',
  user: mockUserInstance,
  performanceId: Random.id,
  isClosed: true,
  status: PerformanceStatusEnum.PASSED,
  result: 80,
  endDate: Random.datePast,
  test: mockTestInstance,
  questionAttempts: [mockSingleTestQuestionAttemptInstance],
  passingScore: 75,
};

export const mockTestAttemptInstance = plainToInstance(TestAttemptEntity, mockTestAttempt);

const mockCourseAttempt = {
  ...mockBaseEntity,
  timeSpent: '00:20:00',
  user: mockUserInstance,
  performanceId: Random.id,
  isClosed: true,
  status: PerformanceStatusEnum.PASSED,
  result: 80,
  endDate: Random.datePast,
  course: mockCourseInstance,
};

export const mockCourseAttemptInstance = plainToInstance(CourseAttemptEntity, mockCourseAttempt);

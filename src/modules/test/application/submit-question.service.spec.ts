import {
  answerAttemptRepositoryMockProvider,
  answerRepositoryMockProvider,
  questionInThemeRepositoryMockProvider,
  testAttemptRepositoryMockProvider,
  TestHelper,
  testPerformanceRepositoryMockProvider,
  testQuestionAttemptRepositoryMockProvider,
  testQuestionRepositoryMockProvider,
  testRepositoryMockProvider,
  userRepositoryMockProvider,
} from '@core/test/test.helper';
import { SubmitQuestionService } from '@modules/test/application/submit-question.service';
import { Random } from '@core/test/random';
import { AnswerAttemptEntity, TestQuestionAttemptEntity } from '@modules/performance/domain/attempt.entity';
import {
  mockSingleAnswerAttemptInstance,
  mockSingleTestQuestionAttemptInstance,
  mockTestAttemptInstance,
} from '@modules/performance/domain/attempt.entity.spec';
import clearAllMocks = jest.clearAllMocks;
import { TestAttemptRepository } from '@modules/performance/infrastructure/database/attempt.repository';

jest.mock('@modules/performance/domain/attempt.entity');
//@ts-ignore
AnswerAttemptEntity.mockImplementation(() => mockSingleAnswerAttemptInstance);
//@ts-ignore
TestQuestionAttemptEntity.mockImplementation(() => mockSingleTestQuestionAttemptInstance);

const helpers = new TestHelper(
  testQuestionRepositoryMockProvider,
  userRepositoryMockProvider,
  testRepositoryMockProvider,
  testPerformanceRepositoryMockProvider,
  testQuestionAttemptRepositoryMockProvider,
  testAttemptRepositoryMockProvider,
  answerRepositoryMockProvider,
  answerAttemptRepositoryMockProvider,
  questionInThemeRepositoryMockProvider,
);

describe('SubmitQuestionService', () => {
  let submitQuestionService: SubmitQuestionService;

  beforeAll(async () => {
    [submitQuestionService] = await helpers.beforeAll([SubmitQuestionService]);
  });

  test('Should submit testQuestion', async () => {
    await submitQuestionService.submit({
      questionId: Random.id,
      performanceId: Random.id,
      testId: Random.id,
      submittedAnswers: [
        {
          answerId: Random.id,
          isCorrect: Random.boolean,
          correctAnswer: Random.lorem,
          order: Random.number,
          definition: Random.lorem,
        },
      ],
    });

    const mockAnswerAttemptRepository = helpers.getProviderValueByToken('AnswerAttemptRepository');
    const mockTestQuestionAttemptRepository = helpers.getProviderValueByToken('TestQuestionAttemptRepository');
    const mockTestAttemptRepository = helpers.getProviderValueByToken('TestAttemptRepository');

    mockSingleTestQuestionAttemptInstance.answerAttempts = [mockSingleAnswerAttemptInstance];
    mockTestAttemptInstance.addQuestionAttempt(mockSingleTestQuestionAttemptInstance);
    expect(mockAnswerAttemptRepository.save).toHaveBeenCalledWith(mockSingleAnswerAttemptInstance);
    expect(mockTestQuestionAttemptRepository.save).toHaveBeenCalledWith(mockSingleTestQuestionAttemptInstance);
  });

  test('Should submit many testQuestions', async () => {
    await submitQuestionService.submitMany({
      submittedQuestions: [
        {
          questionId: Random.id,
          performanceId: Random.id,
          testId: Random.id,
          submittedAnswers: [
            {
              answerId: Random.id,
              isCorrect: Random.boolean,
              correctAnswer: Random.lorem,
              order: Random.number,
              definition: Random.lorem,
            },
          ],
        },
      ],
    });

    const mockAnswerAttemptRepository = helpers.getProviderValueByToken('AnswerAttemptRepository');
    const mockTestQuestionAttemptRepository = helpers.getProviderValueByToken('TestQuestionAttemptRepository');
    const mockTestAttemptRepository = helpers.getProviderValueByToken('TestAttemptRepository');

    mockSingleTestQuestionAttemptInstance.answerAttempts = [mockSingleAnswerAttemptInstance];
    mockTestAttemptInstance.addQuestionAttempt(mockSingleTestQuestionAttemptInstance);
    expect(mockAnswerAttemptRepository.save).toHaveBeenCalledWith(mockSingleAnswerAttemptInstance);
    expect(mockTestQuestionAttemptRepository.save).toHaveBeenCalledWith(mockSingleTestQuestionAttemptInstance);
  });

  afterEach(() => {
    clearAllMocks();
  });
});

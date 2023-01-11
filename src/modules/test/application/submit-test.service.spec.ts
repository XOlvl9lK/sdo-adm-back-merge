import {
  answerAttemptRepositoryMockProvider,
  educationProgramPerformanceRepositoryMockProvider,
  performanceRepositoryMockProvider,
  savedQuestionsOrderRepositoryMockProvider,
  testAttemptRepositoryMockProvider,
  TestHelper,
  testPerformanceRepositoryMockProvider,
  testQuestionAttemptRepositoryMockProvider,
  testRepositoryMockProvider,
} from '@core/test/test.helper';
import { SubmitTestService } from '@modules/test/application/submit-test.service';
import { Random } from '@core/test/random';
import { TestPerformanceRepository } from '@modules/performance/infrastructure/database/performance.repository';

const helpers = new TestHelper(
  testPerformanceRepositoryMockProvider,
  testAttemptRepositoryMockProvider,
  testQuestionAttemptRepositoryMockProvider,
  answerAttemptRepositoryMockProvider,
  savedQuestionsOrderRepositoryMockProvider,
  testRepositoryMockProvider,
  educationProgramPerformanceRepositoryMockProvider,
  performanceRepositoryMockProvider,
);

describe('SubmitTestService', () => {
  let submitTestService: SubmitTestService;

  beforeAll(async () => {
    [submitTestService] = await helpers.beforeAll([SubmitTestService]);
  });

  test('Should submit test and emit', async () => {
    await submitTestService.submit(Random.id, Random.id);

    const mockEventEmitter = helpers.getProviderValueByToken('EventEmitter2');
    const mockTestPerformanceRepository = helpers.getProviderValueByToken('TestPerformanceRepository');

    expect(mockEventEmitter.emit).toHaveBeenCalledTimes(1);
    expect(mockTestPerformanceRepository.save).toHaveBeenCalledTimes(1);
  });
});

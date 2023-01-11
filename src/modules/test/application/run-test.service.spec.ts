import {
  savedQuestionsOrderRepositoryMockProvider,
  testAttemptRepositoryMockProvider,
  TestHelper,
  testPerformanceRepositoryMockProvider,
  testRepositoryMockProvider,
} from '@core/test/test.helper';
import { RunTestService } from '@modules/test/application/run-test.service';
import { CreateSavedQuestionsOrderService } from '@modules/test/application/create-saved-questions-order.service';
import { SubmitTestService } from '@modules/test/application/submit-test.service';

const helpers = new TestHelper(
  testPerformanceRepositoryMockProvider,
  testAttemptRepositoryMockProvider,
  testRepositoryMockProvider,
  savedQuestionsOrderRepositoryMockProvider,
);

describe('RunTestService', () => {
  let runTestService: RunTestService;

  beforeAll(async () => {
    [runTestService] = await helpers.beforeAll(
      [RunTestService],
      [
        {
          provide: CreateSavedQuestionsOrderService,
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: SubmitTestService,
          useValue: {
            submit: jest.fn(),
          },
        },
      ],
    );
  });

  test('Should run test and emit', async () => {
    // const result = await runTestService.runTest(Random.id, Random.id)
    //
    // const mockEventEmitter2 = helpers.getProviderValueByToken('EventEmitter2')
    //
    // expect(result).toEqual({
    //   ...mockTestPerformanceInstance,
    //   test: mockTestInstance
    // })
    // expect(mockEventEmitter2.emit).toHaveBeenCalledTimes(1)
  });
});

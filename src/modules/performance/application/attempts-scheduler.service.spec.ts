import { TestHelper } from '@core/test/test.helper';
import { AttemptsSchedulerService } from '@modules/performance/application/attempts-scheduler.service';
import { AttemptRepository } from '@modules/performance/infrastructure/database/attempt.repository';
import { mockTestAttemptInstance } from '@modules/performance/domain/attempt.entity.spec';
import { SubmitTestService } from '@modules/test/application/submit-test.service';
import { SubmitCourseService } from '@modules/course/application/submit-course.service';

const helpers = new TestHelper();

describe('AttemptsSchedulerService', () => {
  let attemptsSchedulerService: AttemptsSchedulerService;

  beforeAll(async () => {
    [attemptsSchedulerService] = await helpers.beforeAll(
      [AttemptsSchedulerService],
      [
        {
          provide: AttemptRepository,
          useValue: {
            findExpired: jest.fn().mockResolvedValue([mockTestAttemptInstance]),
          },
        },
        {
          provide: SubmitTestService,
          useValue: {
            submit: jest.fn(),
          },
        },
        {
          provide: SubmitCourseService,
          useValue: {
            submit: jest.fn(),
          },
        },
      ],
    );
  });

  test('Should submit expired attempts', async () => {
    await attemptsSchedulerService.closeExpiredAttempt();

    const mockSubmitTestService = helpers.getProviderValueByToken('SubmitTestService');

    expect(mockSubmitTestService.submit).toHaveBeenCalledTimes(1);
  });
});

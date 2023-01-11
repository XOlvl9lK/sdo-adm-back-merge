import {
  courseAttemptRepositoryMockProvider,
  coursePerformanceRepositoryMockProvider,
  educationProgramPerformanceRepositoryMockProvider,
  performanceRepositoryMockProvider,
  TestHelper,
} from '@core/test/test.helper';
import { SubmitCourseService } from '@modules/course/application/submit-course.service';
import { CourseSuspendDataService } from '@modules/course/application/course-suspend-data.service';
import { Random } from '@core/test/random';
import {
  mockCoursePerformanceInstance,
  mockEducationProgramPerformanceInstance,
} from '@modules/performance/domain/performance.entity.spec';
import { EventActionEnum } from '@modules/event/application/create-event.service';
import { StartTrainingEvent } from '@modules/event/infrastructure/events/start-training.event';
import { mockCourseAttemptInstance } from '@modules/performance/domain/attempt.entity.spec';

const helpers = new TestHelper(
  coursePerformanceRepositoryMockProvider,
  courseAttemptRepositoryMockProvider,
  educationProgramPerformanceRepositoryMockProvider,
  performanceRepositoryMockProvider,
);

describe('SubmitCourseService', () => {
  let submitCourseService: SubmitCourseService;

  beforeAll(async () => {
    [submitCourseService] = await helpers.beforeAll(
      [SubmitCourseService],
      [
        {
          provide: CourseSuspendDataService,
          useValue: {
            clearSuspendData: jest.fn(),
          },
        },
      ],
    );
  });

  test('Should update program performance', async () => {
    await submitCourseService['updateProgramPerformance'](Random.id);

    const mockEducationProgramPerformanceRepository = helpers.getProviderValueByToken(
      'EducationProgramPerformanceRepository',
    );

    expect(mockEducationProgramPerformanceRepository.save).toHaveBeenCalledTimes(1);
    expect(mockEducationProgramPerformanceRepository.save).toHaveBeenCalledWith(
      mockEducationProgramPerformanceInstance,
    );
  });

  test('Should submit course and emit', async () => {
    await submitCourseService.submit(Random.id, Random.id);

    const mockEventEmitter = helpers.getProviderValueByToken('EventEmitter2');
    const mockCoursePerformanceRepository = helpers.getProviderValueByToken('CoursePerformanceRepository');
    const mockCourseAttemptRepository = helpers.getProviderValueByToken('CourseAttemptRepository');

    expect(mockEventEmitter.emit).toHaveBeenCalledTimes(1);
    expect(mockEventEmitter.emit).toHaveBeenCalledWith(
      EventActionEnum.END_TRAINING,
      new StartTrainingEvent(Random.id, Random.id),
    );
    expect(mockCoursePerformanceRepository.save).toHaveBeenCalledTimes(1);
    expect(mockCoursePerformanceRepository.save).toHaveBeenCalledWith(mockCoursePerformanceInstance);
    expect(mockCourseAttemptRepository.save).toHaveBeenCalledTimes(1);
  });
});

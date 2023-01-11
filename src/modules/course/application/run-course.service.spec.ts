import {
  courseAttemptRepositoryMockProvider,
  coursePerformanceRepositoryMockProvider,
  courseRepositoryMockProvider,
  TestHelper,
  userRepositoryMockProvider,
} from '@core/test/test.helper';
import { RunCourseService } from '@modules/course/application/run-course.service';
import { Random } from '@core/test/random';
import { mockCoursePerformanceInstance } from '@modules/performance/domain/performance.entity.spec';
import { CourseAttemptEntity } from '@modules/performance/domain/attempt.entity';
import { mockCourseAttemptInstance } from '@modules/performance/domain/attempt.entity.spec';
jest.mock('@modules/performance/domain/attempt.entity');
//@ts-ignore
CourseAttemptEntity.mockImplementation(() => mockCourseAttemptInstance);

const helpers = new TestHelper(
  coursePerformanceRepositoryMockProvider,
  userRepositoryMockProvider,
  courseAttemptRepositoryMockProvider,
  courseRepositoryMockProvider,
);

describe('RunCourseService', () => {
  let runCourseService: RunCourseService;

  beforeAll(async () => {
    [runCourseService] = await helpers.beforeAll([RunCourseService]);
  });

  test('Should create course attempt', async () => {
    const result = await runCourseService['createCourseAttempt']({
      userId: Random.id,
      performance: mockCoursePerformanceInstance,
      courseId: Random.id,
    });

    const mockCourseAttemptRepository = helpers.getProviderValueByToken('CourseAttemptRepository');

    expect(mockCourseAttemptRepository.save).toHaveBeenCalledTimes(1);
    expect(mockCourseAttemptRepository.save).toHaveBeenCalledWith(mockCourseAttemptInstance);
    expect(result).toEqual(mockCourseAttemptInstance);
  });

  test('Should run course attempt', async () => {
    await runCourseService.runCourseAttempt({
      performanceId: Random.id,
      userId: Random.id,
      courseId: Random.id,
    });

    const mockCoursePerformanceRepository = helpers.getProviderValueByToken('CoursePerformanceRepository');

    expect(mockCoursePerformanceRepository.save).toHaveBeenCalledTimes(1);
    expect(mockCoursePerformanceRepository.save).toHaveBeenCalledWith(mockCoursePerformanceInstance);
  });
});

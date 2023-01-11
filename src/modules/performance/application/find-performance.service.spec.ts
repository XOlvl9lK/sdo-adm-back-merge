import {
  courseAttemptRepositoryMockProvider,
  coursePerformanceRepositoryMockProvider,
  educationProgramPerformanceRepositoryMockProvider,
  performanceRepositoryMockProvider,
  testAttemptRepositoryMockProvider,
  TestHelper,
  testPerformanceRepositoryMockProvider,
  testRepositoryMockProvider,
} from '@core/test/test.helper';
import { FindPerformanceService } from '@modules/performance/application/find-performance.service';
import { Random } from '@core/test/random';
import {
  mockCoursePerformanceInstance,
  mockEducationProgramPerformanceInstance,
  mockTestPerformanceInstance,
} from '@modules/performance/domain/performance.entity.spec';
import { mockCourseAttemptInstance, mockTestAttemptInstance } from '@modules/performance/domain/attempt.entity.spec';

const helpers = new TestHelper(
  performanceRepositoryMockProvider,
  testPerformanceRepositoryMockProvider,
  coursePerformanceRepositoryMockProvider,
  testAttemptRepositoryMockProvider,
  testRepositoryMockProvider,
  courseAttemptRepositoryMockProvider,
  educationProgramPerformanceRepositoryMockProvider,
);

describe('FindPerformanceService', () => {
  let findPerformanceService: FindPerformanceService;

  beforeAll(async () => {
    [findPerformanceService] = await helpers.beforeAll([FindPerformanceService]);
  });

  test('Should return performance by user', async () => {
    const result = await findPerformanceService.findByUser(Random.id, {});

    expect(result).toEqual([[mockTestPerformanceInstance], Random.number]);
  });

  test('Should return user timeTable', async () => {
    const result = await findPerformanceService.findUserTimeTable(Random.id, {});

    expect(result).toEqual([[mockTestPerformanceInstance], Random.number]);
  });

  test('Should return test performance by id', async () => {
    const result = await findPerformanceService.findUserTestPerformanceById(Random.id);

    expect(result).toEqual({
      ...mockTestPerformanceInstance,
      attempts: [mockTestAttemptInstance],
    });
  });

  test('Should return test attempt by id', async () => {
    const result = await findPerformanceService.findTestAttemptById(Random.id);

    expect(result).toEqual(mockTestAttemptInstance);
  });

  test('Should run course', async () => {
    const result = await findPerformanceService.runCourse(Random.id, Random.id);

    const mockEventEmitter = helpers.getProviderValueByToken('EventEmitter2');

    expect(mockEventEmitter.emit).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockCoursePerformanceInstance);
  });

  test('Should return course performance by id', async () => {
    const result = await findPerformanceService.findCoursePerformanceById(Random.id);

    expect(result).toEqual({
      ...mockCoursePerformanceInstance,
      attempts: [mockCourseAttemptInstance],
    });
  });

  test('Should return program performance by id', async () => {
    const result = await findPerformanceService.findProgramPerformanceById(Random.id);

    expect(result).toEqual({
      educationProgramPerformance: mockEducationProgramPerformanceInstance,
      programElementPerformances: [mockTestPerformanceInstance],
    });
  });

  test('Should run education program', async () => {
    const result = await findPerformanceService.runEducationProgram(Random.id);
  });
});

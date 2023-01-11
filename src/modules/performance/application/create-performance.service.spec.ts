import {
  assignmentRepositoryMockProvider,
  coursePerformanceRepositoryMockProvider,
  courseRepositoryMockProvider,
  educationElementRepositoryMockProvider,
  educationProgramPerformanceRepositoryMockProvider,
  educationProgramRepositoryMockProvider,
  TestHelper,
  testPerformanceRepositoryMockProvider,
  testRepositoryMockProvider,
  userRepositoryMockProvider,
} from '@core/test/test.helper';
import { CreatePerformanceService } from '@modules/performance/application/create-performance.service';
import { Random } from '@core/test/random';
import {
  CoursePerformanceEntity,
  EducationProgramPerformanceEntity,
  TestPerformanceEntity,
} from '@modules/performance/domain/performance.entity';
import {
  mockCoursePerformanceInstance,
  mockEducationProgramPerformanceInstance,
  mockTestPerformanceInstance,
} from '@modules/performance/domain/performance.entity.spec';
jest.mock('@modules/performance/domain/performance.entity');
//@ts-ignore
CoursePerformanceEntity.mockImplementation(() => mockCoursePerformanceInstance);
//@ts-ignore
TestPerformanceEntity.mockImplementation(() => mockTestPerformanceInstance);
//@ts-ignore
EducationProgramPerformanceEntity.mockImplementation(() => mockEducationProgramPerformanceInstance);

const helpers = new TestHelper(
  userRepositoryMockProvider,
  educationElementRepositoryMockProvider,
  coursePerformanceRepositoryMockProvider,
  courseRepositoryMockProvider,
  testRepositoryMockProvider,
  testPerformanceRepositoryMockProvider,
  educationProgramRepositoryMockProvider,
  educationProgramPerformanceRepositoryMockProvider,
  assignmentRepositoryMockProvider,
);

describe('CreatePerformanceService', () => {
  let createPerformanceService: CreatePerformanceService;

  beforeAll(async () => {
    [createPerformanceService] = await helpers.beforeAll([CreatePerformanceService]);
  });

  test('Should create course performance', async () => {
    await createPerformanceService.createCoursePerformance({
      assignmentId: Random.id,
      attemptsLeft: 5,
      courseId: Random.id,
      userId: Random.id,
    });

    const mockCoursePerformanceRepository = helpers.getProviderValueByToken('CoursePerformanceRepository');

    expect(mockCoursePerformanceRepository.save).toHaveBeenCalledTimes(1);
    expect(mockCoursePerformanceRepository.save).toHaveBeenCalledWith(mockCoursePerformanceInstance);
  });

  test('Should create test performance', async () => {
    await createPerformanceService.createTestPerformance({
      userId: Random.id,
      assignmentId: Random.id,
      attemptsLeft: 5,
      testId: Random.id,
    });

    const mockTestPerformanceRepository = helpers.getProviderValueByToken('TestPerformanceRepository');

    expect(mockTestPerformanceRepository.save).toHaveBeenCalledTimes(1);
    expect(mockTestPerformanceRepository.save).toHaveBeenCalledWith(mockTestPerformanceInstance);
  });

  test('Should create education program performance', async () => {
    await createPerformanceService.createEducationProgramPerformance({
      userId: Random.id,
      assignmentId: Random.id,
      attemptsLeft: 5,
      educationProgramId: Random.id,
    });

    const mockEducationProgramPerformanceRepository = helpers.getProviderValueByToken(
      'EducationProgramPerformanceRepository',
    );

    expect(mockEducationProgramPerformanceRepository.save).toHaveBeenCalledTimes(1);
    expect(mockEducationProgramPerformanceRepository.save).toHaveBeenCalledWith(
      mockEducationProgramPerformanceInstance,
    );
  });
});

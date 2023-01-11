import { TestHelper } from '@core/test/test.helper';
import { PerformanceController } from '@modules/performance/controllers/performance.controller';
import { FindPerformanceService } from '@modules/performance/application/find-performance.service';
import {
  mockCoursePerformanceInstance,
  mockEducationProgramPerformanceInstance,
  mockTestPerformanceInstance,
} from '@modules/performance/domain/performance.entity.spec';
import { Random } from '@core/test/random';
import { mockCourseAttemptInstance, mockTestAttemptInstance } from '@modules/performance/domain/attempt.entity.spec';
import { GeneratePerformanceCertificateService } from '@modules/performance/application/generate-perfomance-certificate.service';

const helpers = new TestHelper();

describe('PerformanceController', () => {
  let performanceController: PerformanceController;

  beforeAll(async () => {
    [performanceController] = await helpers.beforeAll(
      [PerformanceController],
      [
        {
          provide: FindPerformanceService,
          useValue: {
            findByUser: jest.fn().mockResolvedValue([[mockTestPerformanceInstance], Random.number]),
            findUserTimeTable: jest.fn().mockResolvedValue([[mockTestPerformanceInstance], Random.number]),
            runCourse: jest.fn().mockResolvedValue(mockCoursePerformanceInstance),
            runEducationProgram: jest.fn().mockResolvedValue({
              educationProgramPerformance: mockEducationProgramPerformanceInstance,
              programElementPerformances: [mockTestPerformanceInstance],
            }),
            findUserTestPerformanceById: jest.fn().mockResolvedValue({
              ...mockTestPerformanceInstance,
              attempts: [mockTestAttemptInstance],
            }),
            findTestAttemptById: jest.fn().mockResolvedValue(mockTestAttemptInstance),
            findCoursePerformanceById: jest.fn().mockResolvedValue({
              ...mockCoursePerformanceInstance,
              attempts: [mockCourseAttemptInstance],
            }),
            findProgramPerformanceById: jest.fn().mockResolvedValue({
              educationProgramPerformance: mockEducationProgramPerformanceInstance,
              programElementPerformances: [mockTestPerformanceInstance],
            }),
          },
        },
        {
          provide: GeneratePerformanceCertificateService,
          useValue: {
            handle: jest.fn(),
          },
        },
      ],
      [PerformanceController],
    );
  });

  test('Should return user performance', async () => {
    const result = await performanceController.getUserPerformance(Random.id, {});

    expect(result).toEqual({
      data: [{ ...mockTestPerformanceInstance, canRun: true }],
      total: Random.number,
    });
  });

  test('Should return user time table', async () => {
    const result = await performanceController.getTimeTable(Random.id, {});

    expect(result).toEqual({
      data: [mockTestPerformanceInstance],
      total: Random.number,
    });
  });

  test('Should run course', async () => {
    const result = await performanceController.runCourse(Random.id, Random.id);

    expect(result).toEqual(mockCoursePerformanceInstance);
  });

  test('Should run education program', async () => {
    const result = await performanceController.runEducationProgram(Random.id);

    expect(result).toEqual({
      educationProgramPerformance: mockEducationProgramPerformanceInstance,
      programElementPerformances: [mockTestPerformanceInstance],
    });
  });

  test('Should return user test performance by id', async () => {
    const result = await performanceController.getUserTestPerformanceById(Random.id);

    expect(result).toEqual({
      ...mockTestPerformanceInstance,
      attempts: [mockTestAttemptInstance],
    });
  });

  test('Should return test attempt by id', async () => {
    const result = await performanceController.getTestAttemptById(Random.id);

    expect(result).toEqual(mockTestAttemptInstance);
  });

  test('Should return course performance by id', async () => {
    const result = await performanceController.getCoursePerformanceById(Random.id);

    expect(result).toEqual({
      ...mockCoursePerformanceInstance,
      attempts: [mockCourseAttemptInstance],
    });
  });

  test('Should return program performance by id', async () => {
    const result = await performanceController.getProgramPerformanceById(Random.id);

    expect(result).toEqual({
      educationProgramPerformance: mockEducationProgramPerformanceInstance,
      programElementPerformances: [mockTestPerformanceInstance],
    });
  });
});

import { groupRepositoryMockProvider, TestHelper } from '@core/test/test.helper';
import { EducationRequestGroupEnrollEventHandler } from '@modules/performance/application/education-request-group-enroll.event-handler';
import { CreatePerformanceService } from '@modules/performance/application/create-performance.service';
import { Random } from '@core/test/random';
import { EducationElementTypeEnum } from '@modules/education-program/domain/education-element.entity';
import clearAllMocks = jest.clearAllMocks;

const helpers = new TestHelper(groupRepositoryMockProvider);

describe('EducationRequestGroupEnrollEventHandler', () => {
  let educationRequestGroupEnrollEventHandler: EducationRequestGroupEnrollEventHandler;

  beforeAll(async () => {
    [educationRequestGroupEnrollEventHandler] = await helpers.beforeAll(
      [EducationRequestGroupEnrollEventHandler],
      [
        {
          provide: CreatePerformanceService,
          useValue: {
            createTestPerformance: jest.fn(),
            createEducationProgramPerformance: jest.fn(),
            createCoursePerformance: jest.fn(),
          },
        },
      ],
    );
  });

  test('Should call createTestPerformance', async () => {
    await educationRequestGroupEnrollEventHandler.handle({
      educationElementId: Random.id,
      educationElementType: EducationElementTypeEnum.TEST,
      assignmentId: Random.id,
      groupId: Random.id,
    });

    const mockCreatePerformanceService = helpers.getProviderValueByToken('CreatePerformanceService');

    expect(mockCreatePerformanceService.createTestPerformance).toHaveBeenCalledTimes(1);
  });

  test('Should call createEducationProgramPerformance', async () => {
    await educationRequestGroupEnrollEventHandler.handle({
      educationElementId: Random.id,
      educationElementType: EducationElementTypeEnum.PROGRAM,
      assignmentId: Random.id,
      groupId: Random.id,
    });

    const mockCreatePerformanceService = helpers.getProviderValueByToken('CreatePerformanceService');

    expect(mockCreatePerformanceService.createEducationProgramPerformance).toHaveBeenCalledTimes(1);
  });

  test('Should call createCoursePerformance', async () => {
    await educationRequestGroupEnrollEventHandler.handle({
      educationElementId: Random.id,
      educationElementType: EducationElementTypeEnum.COURSE,
      assignmentId: Random.id,
      groupId: Random.id,
    });

    const mockCreatePerformanceService = helpers.getProviderValueByToken('CreatePerformanceService');

    expect(mockCreatePerformanceService.createCoursePerformance).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    clearAllMocks();
  });
});

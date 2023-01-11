import { TestHelper } from '@core/test/test.helper';
import { EducationRequestAcceptEventHandler } from '@modules/performance/application/education-request-accept.event-handler';
import { CreatePerformanceService } from '@modules/performance/application/create-performance.service';
import { Random } from '@core/test/random';
import { EducationElementTypeEnum } from '@modules/education-program/domain/education-element.entity';
import clearAllMocks = jest.clearAllMocks;

const helpers = new TestHelper();

describe('EducationRequestAcceptEventHandler', () => {
  let educationRequestAcceptEventHandler: EducationRequestAcceptEventHandler;

  beforeAll(async () => {
    [educationRequestAcceptEventHandler] = await helpers.beforeAll(
      [EducationRequestAcceptEventHandler],
      [
        {
          provide: CreatePerformanceService,
          useValue: {
            createTestPerformance: jest.fn(),
            createCoursePerformance: jest.fn(),
            createEducationProgramPerformance: jest.fn(),
          },
        },
      ],
    );
  });

  test('Should call createTestPerformance', async () => {
    await educationRequestAcceptEventHandler['createPerformance']({
      userId: Random.id,
      assignmentId: Random.id,
      educationElementId: Random.id,
      educationElementType: EducationElementTypeEnum.TEST,
      educationRequestId: Random.id,
    });

    const mockCreatePerformanceService = helpers.getProviderValueByToken('CreatePerformanceService');

    expect(mockCreatePerformanceService.createTestPerformance).toHaveBeenCalledTimes(1);
    expect(mockCreatePerformanceService.createTestPerformance).toHaveBeenCalledWith({
      testId: Random.id,
      userId: Random.id,
      attemptsLeft: 5,
      assignmentId: Random.id,
    });
  });

  test('Should call createCoursePerformance', async () => {
    await educationRequestAcceptEventHandler['createPerformance']({
      userId: Random.id,
      assignmentId: Random.id,
      educationElementId: Random.id,
      educationElementType: EducationElementTypeEnum.COURSE,
      educationRequestId: Random.id,
    });

    const mockCreatePerformanceService = helpers.getProviderValueByToken('CreatePerformanceService');

    expect(mockCreatePerformanceService.createCoursePerformance).toHaveBeenCalledTimes(1);
    expect(mockCreatePerformanceService.createCoursePerformance).toHaveBeenCalledWith({
      courseId: Random.id,
      userId: Random.id,
      attemptsLeft: 5,
      assignmentId: Random.id,
    });
  });

  test('Should call createEducationProgramPerformance', async () => {
    await educationRequestAcceptEventHandler['createPerformance']({
      userId: Random.id,
      assignmentId: Random.id,
      educationElementId: Random.id,
      educationElementType: EducationElementTypeEnum.PROGRAM,
      educationRequestId: Random.id,
    });

    const mockCreatePerformanceService = helpers.getProviderValueByToken('CreatePerformanceService');

    expect(mockCreatePerformanceService.createEducationProgramPerformance).toHaveBeenCalledTimes(1);
    expect(mockCreatePerformanceService.createEducationProgramPerformance).toHaveBeenCalledWith({
      educationProgramId: Random.id,
      userId: Random.id,
      attemptsLeft: 5,
      assignmentId: Random.id,
    });
  });

  test('Should call createPerformance', async () => {
    //@ts-ignore
    const createPerformanceSpy = jest.spyOn(educationRequestAcceptEventHandler, 'createPerformance');
    await educationRequestAcceptEventHandler.handleEnrolled({
      userId: Random.id,
      educationElementType: EducationElementTypeEnum.TEST,
      educationElementId: Random.id,
      assignmentId: Random.id,
    });

    expect(createPerformanceSpy).toHaveBeenCalledTimes(1);
    expect(createPerformanceSpy).toHaveBeenCalledWith({
      userId: Random.id,
      educationElementType: EducationElementTypeEnum.TEST,
      educationElementId: Random.id,
      assignmentId: Random.id,
    });
  });

  test('Should call createPerformance', async () => {
    //@ts-ignore
    const createPerformanceSpy = jest.spyOn(educationRequestAcceptEventHandler, 'createPerformance');
    await educationRequestAcceptEventHandler.handleEducationRequestAccept({
      userId: Random.id,
      educationElementType: EducationElementTypeEnum.TEST,
      educationElementId: Random.id,
      assignmentId: Random.id,
      educationRequestId: Random.id,
    });

    expect(createPerformanceSpy).toHaveBeenCalledTimes(1);
    expect(createPerformanceSpy).toHaveBeenCalledWith({
      userId: Random.id,
      educationElementType: EducationElementTypeEnum.TEST,
      educationElementId: Random.id,
      assignmentId: Random.id,
      educationRequestId: Random.id,
    });
  });

  test('Should call createPerformance', async () => {
    //@ts-ignore
    const createPerformanceSpy = jest.spyOn(educationRequestAcceptEventHandler, 'createPerformance');
    await educationRequestAcceptEventHandler.handleCreatePerformanceOnObligatoryUpdated({
      userId: Random.id,
      educationElementType: EducationElementTypeEnum.TEST,
      educationElementId: Random.id,
      assignmentId: Random.id,
    });

    expect(createPerformanceSpy).toHaveBeenCalledTimes(1);
    expect(createPerformanceSpy).toHaveBeenCalledWith({
      userId: Random.id,
      educationElementType: EducationElementTypeEnum.TEST,
      educationElementId: Random.id,
      assignmentId: Random.id,
    });
  });

  afterEach(() => {
    clearAllMocks();
  });
});

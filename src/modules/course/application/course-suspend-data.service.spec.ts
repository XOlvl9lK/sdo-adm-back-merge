import { courseSuspendDataRepositoryMockProvider, TestHelper } from '@core/test/test.helper';
import { CourseSuspendDataService } from '@modules/course/application/course-suspend-data.service';
import { Random } from '@core/test/random';
import { mockCourseSuspendDataInstance } from '@modules/course/domain/course-suspend-data.entity.spec';
import clearAllMocks = jest.clearAllMocks;

const helpers = new TestHelper(courseSuspendDataRepositoryMockProvider);

describe('CourseSuspendDataService', () => {
  let courseSuspendDataService: CourseSuspendDataService;

  beforeAll(async () => {
    [courseSuspendDataService] = await helpers.beforeAll([CourseSuspendDataService]);
  });

  test('Should return suspend data by attempt id', async () => {
    const result = await courseSuspendDataService.findByUserIdAndAttemptId(Random.id);

    expect(result).toEqual(mockCourseSuspendDataInstance);
  });

  test('Should create or update suspend data', async () => {
    await courseSuspendDataService.createOrUpdatedSuspendData({
      suspendData: Random.lorem,
      lessonLocation: Random.lorem,
      attemptId: Random.id,
      lessonStatus: Random.lorem,
      userId: Random.id,
    });

    const mockCourseSuspendDataRepository = helpers.getProviderValueByToken('CourseSuspendDataRepository');

    expect(mockCourseSuspendDataRepository.save).toHaveBeenCalledTimes(1);
    expect(mockCourseSuspendDataRepository.save).toHaveBeenCalledWith(mockCourseSuspendDataInstance);
  });

  test('Should delete suspend data', async () => {
    await courseSuspendDataService.clearSuspendData(Random.id);

    const mockCourseSuspendDataRepository = helpers.getProviderValueByToken('CourseSuspendDataRepository');

    expect(mockCourseSuspendDataRepository.remove).toHaveBeenCalledTimes(1);
    expect(mockCourseSuspendDataRepository.remove).toHaveBeenCalledWith(mockCourseSuspendDataInstance);
  });

  afterEach(() => {
    clearAllMocks();
  });
});

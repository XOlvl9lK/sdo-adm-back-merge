import { TestHelper } from '@core/test/test.helper';
import { CourseSuspendDataController } from '@modules/course/controllers/course-suspend-data.controller';
import { mockCourseSuspendDataInstance } from '@modules/course/domain/course-suspend-data.entity.spec';
import { Random } from '@core/test/random';
import { CourseSuspendDataService } from '@modules/course/application/course-suspend-data.service';

const helpers = new TestHelper();

describe('CourseSuspendDataController', () => {
  let courseSuspendDataController: CourseSuspendDataController;

  beforeAll(async () => {
    [courseSuspendDataController] = await helpers.beforeAll(
      [CourseSuspendDataController],
      [
        {
          provide: CourseSuspendDataService,
          useValue: {
            findByUserIdAndAttemptId: jest.fn().mockResolvedValue(mockCourseSuspendDataInstance),
            createOrUpdatedSuspendData: jest.fn(),
          },
        },
      ],
      [CourseSuspendDataController],
    );
  });

  test('Should return suspend data', async () => {
    const result = await courseSuspendDataController.getByUserIdAndAttemptId(Random.id, Random.id);

    expect(result).toEqual({
      data: mockCourseSuspendDataInstance,
      success: true,
    });
  });

  test('Should call createOrUpdatedSuspendData', async () => {
    await courseSuspendDataController.createOrUpdate({
      suspendData: Random.lorem,
      userId: Random.id,
      attemptId: Random.id,
      lessonStatus: Random.lorem,
      lessonLocation: Random.lorem,
    });

    const mockCourseSuspendDataService = helpers.getProviderValueByToken('CourseSuspendDataService');

    expect(mockCourseSuspendDataService.createOrUpdatedSuspendData).toHaveBeenCalledTimes(1);
    expect(mockCourseSuspendDataService.createOrUpdatedSuspendData).toHaveBeenCalledWith({
      suspendData: Random.lorem,
      userId: Random.id,
      attemptId: Random.id,
      lessonStatus: Random.lorem,
      lessonLocation: Random.lorem,
    });
  });
});

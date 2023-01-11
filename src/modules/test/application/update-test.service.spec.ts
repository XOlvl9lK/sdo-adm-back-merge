import { chapterRepositoryMockProvider, TestHelper, testRepositoryMockProvider } from '@core/test/test.helper';
import { UpdateTestService } from '@modules/test/application/update-test.service';
import { Random } from '@core/test/random';
import { mockTestInstance } from '@modules/test/domain/test.entity.spec';

const helpers = new TestHelper(testRepositoryMockProvider, chapterRepositoryMockProvider);

describe('UpdateTestService', () => {
  let updateTestService: UpdateTestService;

  beforeAll(async () => {
    [updateTestService] = await helpers.beforeAll([UpdateTestService]);
  });

  test('Should update test in database', async () => {
    await updateTestService.update(
      {
        id: Random.id,
        chapterId: Random.id,
        description: 'Description',
        title: 'Title',
        available: false,
        duration: 100,
        selfAssignment: false,
      },
      Random.id,
    );

    mockTestInstance.description = 'Description';
    mockTestInstance.title = 'Title';
    mockTestInstance.available = false;
    mockTestInstance.duration = 100;
    mockTestInstance.isSelfAssignmentAvailable = false;

    const mockTestRepository = helpers.getProviderValueByToken('TestRepository');
    const mockEventEmitter = helpers.getProviderValueByToken('EventEmitter2');

    expect(mockEventEmitter.emit).toHaveBeenCalledTimes(1);
    expect(mockTestRepository.save).toHaveBeenCalledWith(mockTestInstance);
  });

  test('Should increase total themes', async () => {
    await updateTestService.handleAddThemeEvent({ testId: Random.id });

    const mockTestRepository = helpers.getProviderValueByToken('TestRepository');

    mockTestInstance.totalThemes++;
    expect(mockTestRepository.save).toHaveBeenCalledWith(mockTestInstance);
  });
});

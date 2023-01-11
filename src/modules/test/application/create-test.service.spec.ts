import { chapterRepositoryMockProvider, TestHelper, testRepositoryMockProvider } from '@core/test/test.helper';
import { CreateTestService } from '@modules/test/application/create-test.service';
import { Test } from '@nestjs/testing';
import { Random } from '@core/test/random';
import clearAllMocks = jest.clearAllMocks;
import { TestEntity } from '@modules/test/domain/test.entity';
import { mockTestInstance } from '@modules/test/domain/test.entity.spec';
jest.mock('@modules/test/domain/test.entity');
//@ts-ignore
TestEntity.mockImplementation(() => mockTestInstance);

const helpers = new TestHelper(testRepositoryMockProvider, chapterRepositoryMockProvider);

describe('CreateTestService', () => {
  let createTestService: CreateTestService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [CreateTestService, ...helpers.mockProviders, helpers.eventEmitterMockProvider],
    }).compile();

    createTestService = moduleRef.get(CreateTestService);
  });

  test('Should save test in database and emit', async () => {
    await createTestService.create(
      {
        duration: Random.number,
        description: Random.lorem,
        title: Random.lorem,
        chapterId: Random.id,
      },
      Random.id,
    );

    const mockTestRepository = helpers.getProviderByToken('TestRepository').useValue;

    expect(mockTestRepository.save).toHaveBeenCalledTimes(1);
    expect(mockTestRepository.save).toHaveBeenCalledWith(mockTestInstance);
    expect(helpers.eventEmitterMockProvider.useValue.emit).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    clearAllMocks();
  });
});

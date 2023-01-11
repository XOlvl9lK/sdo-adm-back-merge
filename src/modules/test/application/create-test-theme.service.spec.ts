import {
  TestHelper,
  testRepositoryMockProvider,
  testThemeRepositoryMockProvider,
  themeInTestRepositoryMockProvider,
} from '@core/test/test.helper';
import { CreateTestThemeService } from '@modules/test/application/create-test-theme.service';
import { Test } from '@nestjs/testing';
import { Random } from '@core/test/random';
import {
  TestThemeRepository,
  ThemeInTestRepository,
} from '@modules/test/infrastructure/database/test-theme.repository';
import clearAllMocks = jest.clearAllMocks;
import { TestThemeEntity } from '@modules/test/domain/test-theme.entity';
import { mockTestThemeInstance } from '@modules/test/domain/test-theme.entity.spec';
import { ThemeInTestEntity } from '@modules/test/domain/test.entity';
import { mockThemeInTestInstance } from '@modules/test/domain/test.entity.spec';
jest.mock('@modules/test/domain/test-theme.entity');
jest.mock('@modules/test/domain/test.entity');
//@ts-ignore
TestThemeEntity.mockImplementation(() => mockTestThemeInstance);
//@ts-ignore
ThemeInTestEntity.mockImplementation(() => mockThemeInTestInstance);

const helpers = new TestHelper(
  testThemeRepositoryMockProvider,
  testRepositoryMockProvider,
  themeInTestRepositoryMockProvider,
);

describe('CreateTestThemeService', () => {
  let createTestThemeService: CreateTestThemeService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [CreateTestThemeService, ...helpers.mockProviders, helpers.eventEmitterMockProvider],
    }).compile();

    createTestThemeService = moduleRef.get(CreateTestThemeService);
  });

  test('Should save test theme in database and emit', async () => {
    await createTestThemeService.create(
      {
        title: Random.lorem,
        description: Random.lorem,
        questionsToDisplay: Random.number,
      },
      Random.id,
    );

    const mockTestThemeRepository = helpers.getProviderByToken('TestThemeRepository').useValue;

    expect(mockTestThemeRepository.save).toHaveBeenCalledTimes(1);
    expect(mockTestThemeRepository.save).toHaveBeenCalledWith(mockTestThemeInstance);
    expect(helpers.eventEmitterMockProvider.useValue.emit).toHaveBeenCalledTimes(1);
  });

  test('Should save themeInTest in database and emit twice', async () => {
    await createTestThemeService.createInTest(
      {
        title: Random.lorem,
        description: Random.lorem,
        questionsToDisplay: Random.number,
        testId: Random.id,
      },
      Random.id,
    );

    const mockThemeInTestRepository = helpers.getProviderByToken('ThemeInTestRepository').useValue;

    expect(mockThemeInTestRepository.save).toHaveBeenCalledTimes(1);
    expect(mockThemeInTestRepository.save).toHaveBeenCalledWith(mockThemeInTestInstance);
    expect(helpers.eventEmitterMockProvider.useValue.emit).toHaveBeenCalledTimes(2);
  });

  afterEach(() => {
    clearAllMocks();
  });
});

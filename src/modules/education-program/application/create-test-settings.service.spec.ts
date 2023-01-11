import { TestHelper, testSettingsRepositoryMockProvider } from '@core/test/test.helper';
import { CreateTestSettingsService } from '@modules/education-program/application/create-test-settings.service';
import { Random } from '@core/test/random';
import { MixingTypeEnum, TestSettingsEntity } from '@modules/education-program/domain/test-settings.entity';
import { mockTestSettingsInstance } from '@modules/education-program/domain/test-settings.entity.spec';
jest.mock('@modules/education-program/domain/test-settings.entity');
//@ts-ignore
TestSettingsEntity.mockImplementation(() => mockTestSettingsInstance);

const helpers = new TestHelper(testSettingsRepositoryMockProvider);

describe('CreateTestSettingsService', () => {
  let createTestSettingsService: CreateTestSettingsService;

  beforeAll(async () => {
    [createTestSettingsService] = await helpers.beforeAll([CreateTestSettingsService]);
  });

  test('Should create test settings', async () => {
    await createTestSettingsService.create({
      timeLimit: 50,
      endDate: Random.dateFuture.toISOString(),
      answerMixingType: MixingTypeEnum.ORIGINAL,
      correctAnswersAvailableDate: Random.dateFuture.toISOString(),
      isCorrectAnswersAvailable: true,
      maxScore: 100,
      numberOfAttempts: 6,
      passingScore: 76,
    });

    const mockTestSettingsRepository = helpers.getProviderValueByToken('TestSettingsRepository');

    expect(mockTestSettingsRepository.save).toHaveBeenCalledTimes(1);
    expect(mockTestSettingsRepository.save).toHaveBeenCalledWith(mockTestSettingsInstance);
  });
});

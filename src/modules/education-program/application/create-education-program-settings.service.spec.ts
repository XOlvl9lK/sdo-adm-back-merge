import { educationProgramSettingsRepositoryMockProvider, TestHelper } from '@core/test/test.helper';
import { CreateEducationProgramSettingsService } from '@modules/education-program/application/create-education-program-settings.service';
import { MixingTypeEnum } from '@modules/education-program/domain/test-settings.entity';
import { EducationProgramSettingsEntity } from '@modules/education-program/domain/education-program-settings.entity';
import { mockEducationProgramSettingsInstance } from '@modules/education-program/domain/education-program-settings.entity.spec';
jest.mock('@modules/education-program/domain/education-program-settings.entity');
//@ts-ignore
EducationProgramSettingsEntity.mockImplementation(() => mockEducationProgramSettingsInstance);

const helpers = new TestHelper(educationProgramSettingsRepositoryMockProvider);

describe('CreateEducationProgramSettingsService', () => {
  let createEducationProgramSettingsService: CreateEducationProgramSettingsService;

  beforeAll(async () => {
    [createEducationProgramSettingsService] = await helpers.beforeAll([CreateEducationProgramSettingsService]);
  });

  test('Should create education program settings', async () => {
    await createEducationProgramSettingsService.create({
      orderOfStudy: MixingTypeEnum.ORIGINAL,
    });

    const mockEducationProgramSettingsRepository = helpers.getProviderValueByToken(
      'EducationProgramSettingsRepository',
    );

    expect(mockEducationProgramSettingsRepository.save).toHaveBeenCalledTimes(1);
    expect(mockEducationProgramSettingsRepository.save).toHaveBeenCalledWith(mockEducationProgramSettingsInstance);
  });
});

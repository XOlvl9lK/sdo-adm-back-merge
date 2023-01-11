import { educationProgramSettingsRepositoryMockProvider, TestHelper } from '@core/test/test.helper';
import { FindEducationProgramSettingsService } from '@modules/education-program/application/find-education-program-settings.service';
import { Random } from '@core/test/random';
import { mockEducationProgramSettingsInstance } from '@modules/education-program/domain/education-program-settings.entity.spec';

const helpers = new TestHelper(educationProgramSettingsRepositoryMockProvider);

describe('FindEducationProgramSettingsService', () => {
  let findEducationProgramSettingsService: FindEducationProgramSettingsService;

  beforeAll(async () => {
    [findEducationProgramSettingsService] = await helpers.beforeAll([FindEducationProgramSettingsService]);
  });

  test('Should return education program settings by id', async () => {
    const result = await findEducationProgramSettingsService.findById(Random.id);

    expect(result).toEqual(mockEducationProgramSettingsInstance);
  });
});

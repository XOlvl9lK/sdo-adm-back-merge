import { programSettingsRepositoryMockProvider, TestHelper } from '@core/test/test.helper';
import { DeleteProgramSettingsService } from '@modules/program-settings/application/delete-program-settings.service';
import { Random } from '@core/test/random';
import { mockProgramSettingsInstance } from '@modules/program-settings/domain/program-settings.entity.spec';

const helpers = new TestHelper(programSettingsRepositoryMockProvider);

describe('DeleteProgramSettingsService', () => {
  let deleteProgramSettingsService: DeleteProgramSettingsService;

  beforeAll(async () => {
    [deleteProgramSettingsService] = await helpers.beforeAll([DeleteProgramSettingsService]);
  });

  test('Should delete programSettings from database', async () => {
    await deleteProgramSettingsService.deleteMany({
      programSettingsIds: Random.ids,
    });

    const mockProgramSettingRepository = helpers.getProviderValueByToken('ProgramSettingRepository');

    expect(mockProgramSettingRepository.remove).toHaveBeenCalledWith([mockProgramSettingsInstance]);
  });
});

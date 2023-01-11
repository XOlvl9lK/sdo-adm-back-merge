import {
  programSettingsRepositoryMockProvider,
  roleDibRepositoryMockProvider,
  TestHelper,
} from '@core/test/test.helper';
import { CreateProgramSettingsService } from '@modules/program-settings/application/create-program-settings.service';
import { ProgramSettingsEntity } from '@modules/program-settings/domain/program-settings.entity';
import { mockProgramSettingsInstance } from '@modules/program-settings/domain/program-settings.entity.spec';
import { Random } from '@core/test/random';
jest.mock('@modules/program-settings/domain/program-settings.entity');
//@ts-ignore
ProgramSettingsEntity.mockImplementation(() => mockProgramSettingsInstance);

const helpers = new TestHelper(programSettingsRepositoryMockProvider, roleDibRepositoryMockProvider);

describe('CreateProgramSettingsService', () => {
  let createProgramSettingsService: CreateProgramSettingsService;

  beforeAll(async () => {
    [createProgramSettingsService] = await helpers.beforeAll([CreateProgramSettingsService]);
  });

  test('Should create and save in database programSettings', async () => {
    await createProgramSettingsService.create({ roleId: Random.id });

    const mockProgramSettingRepository = helpers.getProviderValueByToken('ProgramSettingRepository');

    expect(mockProgramSettingRepository.save).toHaveBeenCalledWith(mockProgramSettingsInstance);
  });
});

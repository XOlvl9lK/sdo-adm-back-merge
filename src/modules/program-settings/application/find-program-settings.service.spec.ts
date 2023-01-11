import { programSettingsRepositoryMockProvider, TestHelper } from '@core/test/test.helper';
import { FindProgramSettingsService } from '@modules/program-settings/application/find-program-settings.service';
import { mockProgramSettingsInstance } from '@modules/program-settings/domain/program-settings.entity.spec';
import { Random } from '@core/test/random';

const helpers = new TestHelper(programSettingsRepositoryMockProvider);

describe('FindProgramSettingsService', () => {
  let findProgramSettingsService: FindProgramSettingsService;

  beforeAll(async () => {
    [findProgramSettingsService] = await helpers.beforeAll([FindProgramSettingsService]);
  });

  test('Should return all programSettings and count', async () => {
    const result = await findProgramSettingsService.findAll({});

    expect(result).toEqual([[mockProgramSettingsInstance], Random.number]);
  });

  test('Should return program settings by id', async () => {
    const result = await findProgramSettingsService.findById(Random.id);

    expect(result).toEqual(mockProgramSettingsInstance);
  });
});

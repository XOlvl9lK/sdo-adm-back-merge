import { TestHelper, testSettingsRepositoryMockProvider } from '@core/test/test.helper';
import { FindTestSettingsService } from '@modules/education-program/application/find-test-settings.service';
import { Random } from '@core/test/random';
import { mockTestSettingsInstance } from '@modules/education-program/domain/test-settings.entity.spec';

const helpers = new TestHelper(testSettingsRepositoryMockProvider);

describe('FindTestSettingsService', () => {
  let findTestSettingsService: FindTestSettingsService;

  beforeAll(async () => {
    [findTestSettingsService] = await helpers.beforeAll([FindTestSettingsService]);
  });

  test('Should return test settings by id', async () => {
    const result = await findTestSettingsService.findById(Random.id);

    expect(result).toEqual(mockTestSettingsInstance);
  });
});

import { TestHelper, themeRepositoryMockProvider } from '@core/test/test.helper';
import { DeleteThemeService } from '@modules/forum/application/delete-theme.service';
import { Random } from '@core/test/random';
import { mockThemeInstance } from '@modules/forum/domain/theme.entity.spec';

const helpers = new TestHelper(themeRepositoryMockProvider);

describe('DeleteThemeService', () => {
  let deleteThemeService: DeleteThemeService;

  beforeAll(async () => {
    [deleteThemeService] = await helpers.beforeAll([DeleteThemeService]);
  });

  test('Should delete theme', async () => {
    await deleteThemeService.delete(Random.id);

    const mockThemeRepository = helpers.getProviderValueByToken('ThemeRepository');

    expect(mockThemeRepository.remove).toHaveBeenCalledTimes(1);
    expect(mockThemeRepository.remove).toHaveBeenCalledWith(mockThemeInstance);
  });
});

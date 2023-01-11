import { forumRepositoryMockProvider, TestHelper, themeRepositoryMockProvider } from '@core/test/test.helper';
import { FindThemeService } from '@modules/forum/application/find-theme.service';
import { mockThemeInstance } from '@modules/forum/domain/theme.entity.spec';
import { Random } from '@core/test/random';
import { mockForumInstance } from '@modules/forum/domain/forum.entity.spec';

const helpers = new TestHelper(themeRepositoryMockProvider, forumRepositoryMockProvider);

describe('FindThemeService', () => {
  let findThemeService: FindThemeService;

  beforeAll(async () => {
    [findThemeService] = await helpers.beforeAll([FindThemeService]);
  });

  test('Should return all themes', async () => {
    const result = await findThemeService.findAll();

    expect(result).toEqual([mockThemeInstance]);
  });

  test('Should return themes by forum id and count', async () => {
    const result = await findThemeService.findByForumId(Random.id, {});

    expect(result).toEqual({
      total: Random.number,
      data: {
        forum: mockForumInstance,
        themes: [mockThemeInstance],
      },
    });
  });

  test('Should return theme by id', async () => {
    const result = await findThemeService.findById(Random.id);

    expect(result).toEqual(mockThemeInstance);
  });
});

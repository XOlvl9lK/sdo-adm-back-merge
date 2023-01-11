import {
  questionInThemeRepositoryMockProvider,
  TestHelper,
  testThemeRepositoryMockProvider,
} from '@core/test/test.helper';
import { FindTestThemeService } from '@modules/test/application/find-test-theme.service';
import { mockSingleQuestionInThemeInstance, mockTestThemeInstance } from '@modules/test/domain/test-theme.entity.spec';
import { Random } from '@core/test/random';

const helpers = new TestHelper(testThemeRepositoryMockProvider, questionInThemeRepositoryMockProvider);

describe('FindTestThemeService', () => {
  let findTestThemeService: FindTestThemeService;

  beforeAll(async () => {
    [findTestThemeService] = await helpers.beforeAll([FindTestThemeService]);
  });

  test('Should return all testThemes and count', async () => {
    const result = await findTestThemeService.findAll({});

    expect(result).toEqual([[mockTestThemeInstance], Random.number]);
  });

  test('Should return testTheme by id with questions and count', async () => {
    const result = await findTestThemeService.findById(Random.id, {});

    expect(result).toEqual({
      total: Random.number,
      data: {
        ...mockTestThemeInstance,
        questions: [mockSingleQuestionInThemeInstance],
      },
    });
  });

  test('Should return testThemes by ids', async () => {
    const result = await findTestThemeService.findByIds({ ids: Random.ids });

    expect(result).toEqual([mockTestThemeInstance]);
  });

  test('Should return testTheme by id for question bank', async () => {
    const result = await findTestThemeService.findByIdForQuestionBank(Random.id, {});

    expect(result).toEqual({
      total: Random.number,
      data: {
        ...mockTestThemeInstance,
        questions: [mockSingleQuestionInThemeInstance],
      },
    });
  });
});

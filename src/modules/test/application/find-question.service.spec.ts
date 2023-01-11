import {
  questionInThemeRepositoryMockProvider,
  TestHelper,
  testQuestionRepositoryMockProvider,
  testThemeRepositoryMockProvider,
} from '@core/test/test.helper';
import { FindQuestionService } from '@modules/test/application/find-question.service';
import { Random } from '@core/test/random';
import { mockSingleTestQuestionInstance } from '@modules/test/domain/test-question.entity.spec';
import clearAllMocks = jest.clearAllMocks;
import { Test } from '@nestjs/testing';
import { mockSingleQuestionInThemeInstance } from '@modules/test/domain/test-theme.entity.spec';

const helpers = new TestHelper(
  testQuestionRepositoryMockProvider,
  testThemeRepositoryMockProvider,
  questionInThemeRepositoryMockProvider,
);

describe('FindQuestionService', () => {
  let findQuestionService: FindQuestionService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [FindQuestionService, ...helpers.mockProviders],
    }).compile();

    findQuestionService = moduleRef.get(FindQuestionService);
  });

  test('Should return testQuestion by id', async () => {
    const result = await findQuestionService.findById(Random.id);

    expect(result).toEqual(mockSingleTestQuestionInstance);
  });

  // test('Should return testQuestions excluding theme', async () => {
  //   const result = await findQuestionService.findExcludingTheme(Random.id, {})
  //
  //   expect(result).toEqual([[mockSingleTestQuestionInstance], Random.number])
  // })

  test('Should return questionInTheme by id', async () => {
    const result = await findQuestionService.findQuestionInThemeById(Random.id);

    expect(result).toEqual(mockSingleQuestionInThemeInstance);
  });

  afterEach(() => {
    clearAllMocks();
  });
});

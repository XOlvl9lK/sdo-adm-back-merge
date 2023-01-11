import {
  questionInThemeRepositoryMockProvider,
  TestHelper,
  testQuestionRepositoryMockProvider,
  testThemeRepositoryMockProvider,
} from '@core/test/test.helper';
import { UpdateQuestionService } from '@modules/test/application/update-question.service';
import { Random } from '@core/test/random';
import { SingleSortActionTypesEnum } from '@modules/test/controllers/dtos/update-test-theme.dto';
import { QuestionInThemeRepository } from '@modules/test/infrastructure/database/test-question.repository';

const helpers = new TestHelper(
  testThemeRepositoryMockProvider,
  questionInThemeRepositoryMockProvider,
  testQuestionRepositoryMockProvider,
);

describe('UpdateQuestionService', () => {
  let updateQuestionService: UpdateQuestionService;

  beforeAll(async () => {
    [updateQuestionService] = await helpers.beforeAll([UpdateQuestionService]);
  });

  test('Should change questions order', async () => {
    await updateQuestionService.changeOrder(
      {
        themeId: Random.id,
        view: 'all',
        sortActionType: SingleSortActionTypesEnum.DOWN,
        questionId: Random.id,
      },
      Random.id,
    );

    const mockEventEmitter = helpers.getProviderValueByToken('EventEmitter2');
    const mockQuestionInThemeRepository = helpers.getProviderValueByToken('QuestionInThemeRepository');

    expect(mockEventEmitter.emit).toHaveBeenCalledTimes(1);
    expect(mockQuestionInThemeRepository.save).toHaveBeenCalledTimes(1);
  });
});

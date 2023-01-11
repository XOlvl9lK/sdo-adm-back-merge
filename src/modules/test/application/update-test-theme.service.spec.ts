import {
  questionInThemeRepositoryMockProvider,
  TestHelper,
  testQuestionRepositoryMockProvider,
  testRepositoryMockProvider,
  testThemeRepositoryMockProvider,
  themeInTestRepositoryMockProvider,
} from '@core/test/test.helper';
import { UpdateTestThemeService } from '@modules/test/application/update-test-theme.service';
import { Random } from '@core/test/random';
import { mockSingleQuestionInThemeInstance, mockTestThemeInstance } from '@modules/test/domain/test-theme.entity.spec';
import { QuestionInThemeEntity } from '@modules/test/domain/test-theme.entity';
import { SingleSortActionTypesEnum } from '@modules/test/controllers/dtos/update-test-theme.dto';
import clearAllMocks = jest.clearAllMocks;
jest.mock('@modules/test/domain/test-theme.entity');
//@ts-ignore
QuestionInThemeEntity.mockImplementation(() => mockSingleQuestionInThemeInstance);

const helpers = new TestHelper(
  testThemeRepositoryMockProvider,
  testQuestionRepositoryMockProvider,
  testRepositoryMockProvider,
  themeInTestRepositoryMockProvider,
  questionInThemeRepositoryMockProvider,
);

describe('UpdateTestThemeService', () => {
  let updateTestThemeService: UpdateTestThemeService;

  beforeAll(async () => {
    [updateTestThemeService] = await helpers.beforeAll([UpdateTestThemeService]);
  });

  test('Should update theme and emit', async () => {
    await updateTestThemeService.update(
      {
        themeId: Random.id,
        description: 'Description',
        title: 'Title',
        questionsToDisplay: 25,
      },
      Random.id,
    );

    const mockTestThemeRepository = helpers.getProviderValueByToken('TestThemeRepository');
    const mockEventEmitter = helpers.getProviderValueByToken('EventEmitter2');

    mockTestThemeInstance.title = 'Title';
    mockTestThemeInstance.description = 'Description';
    mockTestThemeInstance.questionsToDisplay = 25;
    expect(mockEventEmitter.emit).toHaveBeenCalledTimes(1);
    expect(mockTestThemeRepository.save).toHaveBeenCalledWith(mockTestThemeInstance);
  });

  test('Should add question to theme and emit', async () => {
    await updateTestThemeService.addToTheme({ themeIdTo: Random.id, questionIds: [Random.id] });

    const mockEventEmitter = helpers.getProviderValueByToken('EventEmitter2');
    const mockQuestionInThemeRepository = helpers.getProviderValueByToken('QuestionInThemeRepository');

    expect(mockEventEmitter.emit).toHaveBeenCalledTimes(1);
    expect(mockQuestionInThemeRepository.save).toHaveBeenCalledWith([mockSingleQuestionInThemeInstance]);
  });

  test('Should move questions to theme and emit', async () => {
    await updateTestThemeService.moveToTheme({ themeIdTo: Random.id, questionInThemeIds: [Random.id] });

    const mockEventEmitter = helpers.getProviderValueByToken('EventEmitter2');
    const mockQuestionInThemeRepository = helpers.getProviderValueByToken('QuestionInThemeRepository');

    mockSingleQuestionInThemeInstance.order++;
    expect(mockEventEmitter.emit).toHaveBeenCalledTimes(1);
    expect(mockQuestionInThemeRepository.save).toHaveBeenCalledWith([mockSingleQuestionInThemeInstance]);
  });

  test('Should change test theme order and emit', async () => {
    await updateTestThemeService.changeOrder(
      {
        themeId: Random.id,
        view: 'all',
        sortActionType: SingleSortActionTypesEnum.DOWN,
        testId: Random.id,
      },
      Random.id,
    );

    const mockEventEmitter = helpers.getProviderValueByToken('EventEmitter2');
    const mockThemeInTestRepository = helpers.getProviderValueByToken('ThemeInTestRepository');

    expect(mockEventEmitter.emit).toHaveBeenCalledTimes(1);
    expect(mockThemeInTestRepository.save).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    clearAllMocks();
  });
});

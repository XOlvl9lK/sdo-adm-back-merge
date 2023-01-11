import {
  questionInThemeRepositoryMockProvider,
  TestHelper,
  testQuestionRepositoryMockProvider,
  testThemeRepositoryMockProvider,
  userRepositoryMockProvider,
} from '@core/test/test.helper';
import { CreateQuestionService } from '@modules/test/application/create-question.service';
import { Test } from '@nestjs/testing';
import { CreateAnswerService } from '@modules/test/application/create-answer.service';
import { Random } from '@core/test/random';
import { TestQuestionTypesEnum } from '@modules/test/domain/test-question.entity';
import { TestThemeRepository } from '@modules/test/infrastructure/database/test-theme.repository';
import {
  QuestionInThemeRepository,
  TestQuestionRepository,
} from '@modules/test/infrastructure/database/test-question.repository';
import clearAllMocks = jest.clearAllMocks;
import { QuestionInThemeEntity } from '@modules/test/domain/test-theme.entity';
import { mockSingleQuestionInThemeInstance } from '@modules/test/domain/test-theme.entity.spec';
jest.mock('@modules/test/domain/test-theme.entity');
//@ts-ignore
QuestionInThemeEntity.mockImplementation(() => mockSingleQuestionInThemeInstance);

const helpers = new TestHelper(
  testQuestionRepositoryMockProvider,
  testThemeRepositoryMockProvider,
  userRepositoryMockProvider,
  questionInThemeRepositoryMockProvider,
);

describe('CreateQuestionService', () => {
  let createQuestionService: CreateQuestionService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        CreateQuestionService,
        ...helpers.mockProviders,
        helpers.eventEmitterMockProvider,
        {
          provide: CreateAnswerService,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    createQuestionService = moduleRef.get(CreateQuestionService);
  });

  test('Should save testQuestion, update testTheme and emit', async () => {
    await createQuestionService.create(
      {
        title: Random.lorem,
        type: TestQuestionTypesEnum.SINGLE,
        answers: [
          {
            value: Random.lorem,
            correctAnswer: Random.lorem,
            isCorrect: Random.boolean,
            definition: Random.lorem,
            type: TestQuestionTypesEnum.SINGLE,
            order: Random.number,
            mistakesAllowed: Random.number,
          },
        ],
        testThemeId: Random.id,
        authorId: Random.id,
      },
      Random.id,
    );

    const mockTestThemeRepository = helpers.getProviderByToken('TestThemeRepository').useValue;
    const mockQuestionInThemeRepository = helpers.getProviderByToken('QuestionInThemeRepository').useValue;

    expect(mockTestThemeRepository.save).toHaveBeenCalledTimes(1);
    expect(mockQuestionInThemeRepository.save).toHaveBeenCalledTimes(1);
    expect(mockQuestionInThemeRepository.save).toHaveBeenCalledWith(mockSingleQuestionInThemeInstance);
    expect(helpers.eventEmitterMockProvider.useValue.emit).toHaveBeenCalledTimes(1);
  });

  test('Should save child testQuestion, update testTheme and emit', async () => {
    await createQuestionService.createChild(
      {
        title: Random.lorem,
        type: TestQuestionTypesEnum.SINGLE,
        answers: [
          {
            value: Random.lorem,
            correctAnswer: Random.lorem,
            isCorrect: Random.boolean,
            definition: Random.lorem,
            type: TestQuestionTypesEnum.SINGLE,
            order: Random.number,
            mistakesAllowed: Random.number,
          },
        ],
        testThemeId: Random.id,
        authorId: Random.id,
        parentQuestionId: Random.id,
      },
      Random.id,
    );

    const mockTestThemeRepository = helpers.getProviderByToken('TestThemeRepository').useValue;
    const mockQuestionInThemeRepository = helpers.getProviderByToken('QuestionInThemeRepository').useValue;

    expect(mockTestThemeRepository.save).toHaveBeenCalledTimes(1);
    expect(mockQuestionInThemeRepository.save).toHaveBeenCalledTimes(1);
    expect(mockQuestionInThemeRepository.save).toHaveBeenCalledWith(mockSingleQuestionInThemeInstance);
    expect(helpers.eventEmitterMockProvider.useValue.emit).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    clearAllMocks();
  });
});

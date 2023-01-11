import { TestHelper } from '@core/test/test.helper';
import {
  AssociativeAnswerRepository,
  MultipleAnswerRepository,
  OpenAnswerRepository,
  OrderedAnswerRepository,
  SingleAnswerRepository,
} from '@modules/test/infrastructure/database/answer.repository';
import {
  mockAssociativeAnswerInstance,
  mockMultipleAnswerInstance,
  mockOpenAnswerInstance,
  mockOrderedAnswerInstance,
  mockSingleAnswerInstance,
} from '@modules/test/domain/answer.entity.spec';
import { CreateAnswerService } from '@modules/test/application/create-answer.service';
import { Test } from '@nestjs/testing';
import { Random } from '@core/test/random';
import { TestQuestionTypesEnum } from '@modules/test/domain/test-question.entity';
import clearAllMocks = jest.clearAllMocks;
import {
  AssociativeAnswerEntity,
  MultipleAnswerEntity,
  OpenAnswerEntity,
  OrderedAnswerEntity,
  SingleAnswerEntity,
} from '@modules/test/domain/answer.entity';
jest.mock('@modules/test/domain/answer.entity');
//@ts-ignore
SingleAnswerEntity.mockImplementation(() => mockSingleAnswerInstance);
//@ts-ignore
MultipleAnswerEntity.mockImplementation(() => mockMultipleAnswerInstance);
//@ts-ignore
AssociativeAnswerEntity.mockImplementation(() => mockAssociativeAnswerInstance);
//@ts-ignore
OpenAnswerEntity.mockImplementation(() => mockOpenAnswerInstance);
//@ts-ignore
OrderedAnswerEntity.mockImplementation(() => mockOrderedAnswerInstance);

const helpers = new TestHelper(
  { type: 'repository', provide: SingleAnswerRepository, mockValue: mockSingleAnswerInstance },
  { type: 'repository', provide: MultipleAnswerRepository, mockValue: mockMultipleAnswerInstance },
  { type: 'repository', provide: OpenAnswerRepository, mockValue: mockOpenAnswerInstance },
  { type: 'repository', provide: AssociativeAnswerRepository, mockValue: mockAssociativeAnswerInstance },
  { type: 'repository', provide: OrderedAnswerRepository, mockValue: mockOrderedAnswerInstance },
);

describe('CreateAnswerService', () => {
  let createAnswerService: CreateAnswerService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [CreateAnswerService, ...helpers.mockProviders],
    }).compile();

    createAnswerService = moduleRef.get(CreateAnswerService);
  });

  test('Should save single answer in database', async () => {
    await createAnswerService['createSingleAnswer'](Random.lorem, Random.boolean);

    const mockSingleAnswerRepository = helpers.getProviderByToken('SingleAnswerRepository').useValue;

    expect(mockSingleAnswerRepository.save).toHaveBeenCalledTimes(1);
    expect(mockSingleAnswerRepository.save).toHaveBeenCalledWith(mockSingleAnswerInstance);
  });

  test('Should save multiple answer in database', async () => {
    await createAnswerService['createMultipleAnswer'](Random.lorem, Random.boolean);

    const mockMultipleAnswerRepository = helpers.getProviderByToken('MultipleAnswerRepository').useValue;

    expect(mockMultipleAnswerRepository.save).toHaveBeenCalledTimes(1);
    expect(mockMultipleAnswerRepository.save).toHaveBeenCalledWith(mockMultipleAnswerInstance);
  });

  test('Should save open answer in database', async () => {
    await createAnswerService['createOpenAnswer'](Random.lorem, Random.lorem, Random.number);

    const mockOpenAnswerRepository = helpers.getProviderByToken('OpenAnswerRepository').useValue;

    expect(mockOpenAnswerRepository.save).toHaveBeenCalledTimes(1);
    expect(mockOpenAnswerRepository.save).toHaveBeenCalledWith(mockOpenAnswerInstance);
  });

  test('Should save associative answer in database', async () => {
    await createAnswerService['createAssociativeAnswer'](Random.lorem, Random.lorem);

    const mockAssociativeAnswerRepository = helpers.getProviderByToken('AssociativeAnswerRepository').useValue;

    expect(mockAssociativeAnswerRepository.save).toHaveBeenCalledTimes(1);
    expect(mockAssociativeAnswerRepository.save).toHaveBeenCalledWith(mockAssociativeAnswerInstance);
  });

  test('Should save ordered answer in database', async () => {
    await createAnswerService['createOrderedAnswer'](Random.lorem, Random.number);

    const mockOrderedAnswerRepository = helpers.getProviderByToken('OrderedAnswerRepository').useValue;

    expect(mockOrderedAnswerRepository.save).toHaveBeenCalledTimes(1);
    expect(mockOrderedAnswerRepository.save).toHaveBeenCalledWith(mockOrderedAnswerInstance);
  });

  test('Should create all answers', async () => {
    await createAnswerService.create({
      value: Random.lorem,
      correctAnswer: Random.lorem,
      isCorrect: Random.boolean,
      definition: Random.lorem,
      type: TestQuestionTypesEnum.SINGLE,
      order: Random.number,
      mistakesAllowed: Random.number,
    });
    await createAnswerService.create({
      value: Random.lorem,
      correctAnswer: Random.lorem,
      isCorrect: Random.boolean,
      definition: Random.lorem,
      type: TestQuestionTypesEnum.MULTIPLE,
      order: Random.number,
      mistakesAllowed: Random.number,
    });
    await createAnswerService.create({
      value: Random.lorem,
      correctAnswer: Random.lorem,
      isCorrect: Random.boolean,
      definition: Random.lorem,
      type: TestQuestionTypesEnum.OPEN,
      order: Random.number,
      mistakesAllowed: Random.number,
    });
    await createAnswerService.create({
      value: Random.lorem,
      correctAnswer: Random.lorem,
      isCorrect: Random.boolean,
      definition: Random.lorem,
      type: TestQuestionTypesEnum.ORDERED,
      order: Random.number,
      mistakesAllowed: Random.number,
    });
    await createAnswerService.create({
      value: Random.lorem,
      correctAnswer: Random.lorem,
      isCorrect: Random.boolean,
      definition: Random.lorem,
      type: TestQuestionTypesEnum.ASSOCIATIVE,
      order: Random.number,
      mistakesAllowed: Random.number,
    });

    const mockSingleAnswerRepository = helpers.getProviderByToken('SingleAnswerRepository').useValue;
    const mockMultipleAnswerRepository = helpers.getProviderByToken('MultipleAnswerRepository').useValue;
    const mockOpenAnswerRepository = helpers.getProviderByToken('OpenAnswerRepository').useValue;
    const mockAssociativeAnswerRepository = helpers.getProviderByToken('AssociativeAnswerRepository').useValue;
    const mockOrderedAnswerRepository = helpers.getProviderByToken('OrderedAnswerRepository').useValue;

    expect(mockSingleAnswerRepository.save).toHaveBeenCalledTimes(1);
    expect(mockSingleAnswerRepository.save).toHaveBeenCalledWith(mockSingleAnswerInstance);
    expect(mockMultipleAnswerRepository.save).toHaveBeenCalledTimes(1);
    expect(mockMultipleAnswerRepository.save).toHaveBeenCalledWith(mockMultipleAnswerInstance);
    expect(mockOpenAnswerRepository.save).toHaveBeenCalledTimes(1);
    expect(mockOpenAnswerRepository.save).toHaveBeenCalledWith(mockOpenAnswerInstance);
    expect(mockAssociativeAnswerRepository.save).toHaveBeenCalledTimes(1);
    expect(mockAssociativeAnswerRepository.save).toHaveBeenCalledWith(mockAssociativeAnswerInstance);
    expect(mockOrderedAnswerRepository.save).toHaveBeenCalledTimes(1);
    expect(mockOrderedAnswerRepository.save).toHaveBeenCalledWith(mockOrderedAnswerInstance);
  });

  afterEach(() => {
    clearAllMocks();
  });
});

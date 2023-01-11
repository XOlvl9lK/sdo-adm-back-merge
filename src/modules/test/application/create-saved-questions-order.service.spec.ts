import {
  savedQuestionsOrderRepositoryMockProvider,
  TestHelper,
  testThemeRepositoryMockProvider,
} from '@core/test/test.helper';
import { SavedQuestionsOrderRepository } from '@modules/performance/infrastructure/database/saved-questions-order.repository';
import { mockSavedQuestionsOrderInstance } from '@modules/performance/domain/saved-questions-order.entity.spec';
import { CreateSavedQuestionsOrderService } from '@modules/test/application/create-saved-questions-order.service';
import { Test } from '@nestjs/testing';
import { mockTestPerformanceInstance } from '@modules/performance/domain/performance.entity.spec';
import { Random } from '@core/test/random';
import { SavedQuestionsOrderEntity } from '@modules/performance/domain/saved-questions-order.entity';
jest.mock('@modules/performance/domain/saved-questions-order.entity');
//@ts-ignore
SavedQuestionsOrderEntity.mockImplementation(() => mockSavedQuestionsOrderInstance);

const helpers = new TestHelper(testThemeRepositoryMockProvider, savedQuestionsOrderRepositoryMockProvider);

describe('CreateSavedQuestionsOrderService', () => {
  let createSavedQuestionsOrderService: CreateSavedQuestionsOrderService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [CreateSavedQuestionsOrderService, ...helpers.mockProviders],
    }).compile();

    createSavedQuestionsOrderService = moduleRef.get(CreateSavedQuestionsOrderService);
  });

  test('Should save questionsOrder in database', async () => {
    await createSavedQuestionsOrderService.create(
      mockTestPerformanceInstance,
      Random.id,
      Array.from({ length: 5 }).map(() => Random.id),
    );

    const mockSavedQuestionsOrderRepository = helpers.getProviderByToken('SavedQuestionsOrderRepository').useValue;

    expect(mockSavedQuestionsOrderRepository.save).toHaveBeenCalledTimes(1);
    expect(mockSavedQuestionsOrderRepository.save).toHaveBeenCalledWith(mockSavedQuestionsOrderInstance);
  });
});

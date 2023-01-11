import { mockBaseEntity } from '@core/domain/base.entity.mock';
import { Random } from '@core/test/random';
import { mockTestThemeInstance } from '@modules/test/domain/test-theme.entity.spec';
import { plainToInstance } from 'class-transformer';
import { SavedQuestionsOrderEntity } from '@modules/performance/domain/saved-questions-order.entity';

const mockSavedQuestionsOrder = {
  ...mockBaseEntity,
  performanceId: Random.id,
  questionsOrder: Array.from({ length: 5 }).map(() => Random.id),
  testTheme: mockTestThemeInstance,
};

export const mockSavedQuestionsOrderInstance = plainToInstance(SavedQuestionsOrderEntity, mockSavedQuestionsOrder);

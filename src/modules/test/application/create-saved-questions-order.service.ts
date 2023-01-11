import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SavedQuestionsOrderRepository } from '@modules/performance/infrastructure/database/saved-questions-order.repository';
import { TestThemeRepository } from '@modules/test/infrastructure/database/test-theme.repository';
import { SavedQuestionsOrderEntity } from '@modules/performance/domain/saved-questions-order.entity';
import { TestAttemptEntity } from '@modules/performance/domain/attempt.entity';

@Injectable()
export class CreateSavedQuestionsOrderService {
  constructor(
    @InjectRepository(SavedQuestionsOrderRepository)
    private savedQuestionsOrderRepository: SavedQuestionsOrderRepository,
    @InjectRepository(TestThemeRepository)
    private testThemeRepository: TestThemeRepository,
  ) {}

  async create(testAttempt: TestAttemptEntity, themeId: string, questionsOrder: string[]) {
    const theme = await this.testThemeRepository.findById(themeId);
    let savedQuestionOrder = await this.savedQuestionsOrderRepository.findByTestAttemptIdAndThemeId(
      testAttempt.id,
      themeId,
    );
    // Проверка, что на одну тему теста в рамках одной попытки будет лишь один сохранённый порядок
    if (!savedQuestionOrder) savedQuestionOrder = new SavedQuestionsOrderEntity(testAttempt, theme, questionsOrder);
    return await this.savedQuestionsOrderRepository.save(savedQuestionOrder);
  }
}

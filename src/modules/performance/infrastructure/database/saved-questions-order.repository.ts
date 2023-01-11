import { EntityRepository } from 'typeorm';
import { SavedQuestionsOrderEntity } from '@modules/performance/domain/saved-questions-order.entity';
import { BaseRepository } from '@core/database/base.repository';

@EntityRepository(SavedQuestionsOrderEntity)
export class SavedQuestionsOrderRepository extends BaseRepository<SavedQuestionsOrderEntity> {
  findByTestAttemptId(testAttemptId: string) {
    return this.find({
      where: {
        testAttemptId,
      },
    });
  }

  findByTestAttemptIdAndThemeId(testAttemptId: string, themeId: string) {
    return this.findOne({
      where: {
        testAttemptId,
        testThemeId: themeId,
      },
    });
  }
}

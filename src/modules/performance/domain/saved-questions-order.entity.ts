import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '@core/domain/base.entity';
import { PerformanceEntity } from '@modules/performance/domain/performance.entity';
import { TestThemeEntity } from '@modules/test/domain/test-theme.entity';
import { TestAttemptEntity } from '@modules/performance/domain/attempt.entity';

@Entity('saved_questions_order')
export class SavedQuestionsOrderEntity extends BaseEntity {
  @ManyToOne(() => TestAttemptEntity)
  @JoinColumn({ name: 'testAttemptId' })
  testAttempt: TestAttemptEntity;

  @Column({ comment: 'ID попытки' })
  testAttemptId: string;

  @Column('simple-array', { comment: 'Порядок вопросов' })
  questionsOrder: string[];

  @ManyToOne(() => TestThemeEntity)
  @JoinColumn({ name: 'testThemeId' })
  testTheme: TestThemeEntity;

  @Column({ comment: 'ID темы теста' })
  testThemeId: string;

  constructor(testAttempt: TestAttemptEntity, testTheme: TestThemeEntity, questionsOrder: string[]) {
    super();
    this.testAttempt = testAttempt;
    this.testTheme = testTheme;
    this.questionsOrder = questionsOrder;
  }
}

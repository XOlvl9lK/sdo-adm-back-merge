import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { ContentEntity } from '@core/domain/content.entity';
import { TestQuestionEntity } from '@modules/test/domain/test-question.entity';
import { BaseEntity } from '@core/domain/base.entity';
import { IOrderable } from '@core/domain/orderable.interface';

export enum ThemeTypeEnum {
  TEST = 'TEST',
  QUESTION = 'QUESTION',
}

@Entity('test_theme')
export class TestThemeEntity extends ContentEntity {
  @OneToMany(() => QuestionInThemeEntity, questionInTheme => questionInTheme.theme)
  questions: QuestionInThemeEntity[];

  @Column({
    type: 'int',
    nullable: false,
    default: 0,
    comment: 'Количество выводимых вопросов',
  })
  questionsToDisplay: number;

  @Column({
    type: 'varchar',
    nullable: false,
    default: ThemeTypeEnum.TEST,
    comment: 'Тип темы',
  })
  themeType: ThemeTypeEnum;

  constructor(title: string, themeType: ThemeTypeEnum, questionsToDisplay?: number, description?: string) {
    super(title, description);
    this.questionsToDisplay = questionsToDisplay;
    this.themeType = themeType;
  }

  update(title: string, description: string, questionsToDisplay: number) {
    this.title = title.trim();
    this.description = description ? description.trim() : null;
    this.questionsToDisplay = questionsToDisplay;
  }
}

@Entity('question_in_theme')
export class QuestionInThemeEntity extends BaseEntity implements IOrderable {
  @ManyToOne(() => TestThemeEntity, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  theme: TestThemeEntity;

  @Column({ nullable: true, comment: 'ID темы вопроса' })
  themeId: string;

  @ManyToOne(() => TestQuestionEntity, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  question: TestQuestionEntity;

  @Column({ nullable: true, comment: 'ID вопроса' })
  questionId: string;

  @Column({ type: 'int', nullable: false, comment: 'Порядок вывода вопроса' })
  order: number;

  constructor(order: number, theme: TestThemeEntity, question: TestQuestionEntity) {
    super();
    this.order = order;
    this.theme = theme;
    this.question = question;
  }
}

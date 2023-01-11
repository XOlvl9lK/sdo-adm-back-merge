import { Column, Entity, ManyToMany, JoinTable, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import {
  AnswerEntity,
  AssociativeAnswerEntity,
  SingleAnswerEntity,
  OrderedAnswerEntity,
  MultipleAnswerEntity,
  OpenAnswerEntity,
} from '@modules/test/domain/answer.entity';
import { BaseEntity } from '@core/domain/base.entity';
import { AnswerAttemptEntity } from '@modules/performance/domain/attempt.entity';
import { isEqual, sortBy } from 'lodash';
import { UserEntity } from '@modules/user/domain/user.entity';
import { TestThemeEntity } from '@modules/test/domain/test-theme.entity';

export enum TestQuestionTypesEnum {
  SINGLE = 'SINGLE',
  MULTIPLE = 'MULTIPLE',
  ORDERED = 'ORDERED',
  OPEN = 'OPEN',
  ASSOCIATIVE = 'ASSOCIATIVE',
}

@Entity('test_question')
export class TestQuestionEntity extends BaseEntity {
  @Column({ type: 'text', nullable: false, comment: 'Заголовок' })
  title: string;

  @Column({
    type: 'enum',
    enum: TestQuestionTypesEnum,
    default: TestQuestionTypesEnum.SINGLE,
    comment: 'Тип вопроса',
  })
  type: TestQuestionTypesEnum;

  @ManyToMany(() => AnswerEntity, {
    cascade: true,
  })
  @JoinTable()
  answers: AnswerEntity[];

  @ManyToOne(() => UserEntity, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  author?: UserEntity;

  @Column({ nullable: true, comment: 'ID сложность' })
  authorId: string;

  @ManyToOne(() => TestQuestionEntity)
  @JoinColumn({ name: 'parentQuestionId' })
  parentQuestion?: TestQuestionEntity;

  @Column({ nullable: true, comment: 'ID родительского вопроса' })
  parentQuestionId?: string;

  @Column({
    type: 'decimal',
    nullable: false,
    default: 0.5,
    comment: 'Сложность',
  })
  complexity: number;

  @ManyToOne(() => TestThemeEntity)
  @JoinColumn()
  theme?: TestThemeEntity;

  constructor(
    title: string,
    type: TestQuestionTypesEnum,
    answers: AnswerEntity[],
    author: UserEntity,
    testTheme: TestThemeEntity,
    parentQuestion?: TestQuestionEntity,
  ) {
    super();
    this.title = title?.trim();
    this.type = type;
    this.answers = answers;
    this.author = author;
    this.theme = testTheme;
    parentQuestion && (this.parentQuestion = parentQuestion);
  }

  checkSingleAnswer(answerAttempt?: AnswerAttemptEntity) {
    if (!answerAttempt) return false;
    return (this.answers.find(answer => answer.id === answerAttempt.answerId) as SingleAnswerEntity)?.isAnswerCorrect();
  }

  checkMultipleAnswer(answerAttempts?: AnswerAttemptEntity[]) {
    if (!answerAttempts?.length) return false;
    let isCorrect = true;
    const multiAnswers = this.answers as MultipleAnswerEntity[];
    const correctAnswers = multiAnswers.filter(answer => answer.isAnswerCorrect());
    if (correctAnswers.length !== answerAttempts.length) isCorrect = false;
    const attemptAnswerIds = sortBy(answerAttempts.map(attempt => attempt.answerId));
    const correctAnswerIds = sortBy(correctAnswers.map(answer => answer.id));
    if (!isEqual(attemptAnswerIds, correctAnswerIds)) isCorrect = false;
    return isCorrect;
  }

  checkOpenAnswer(answerAttempt?: AnswerAttemptEntity) {
    if (!answerAttempt) return false;
    return (this.answers.find(answer => answer.id === answerAttempt?.answerId) as OpenAnswerEntity)?.isAnswerCorrect(
      answerAttempt?.correctAnswer,
    );
  }

  checkOrderedAnswer(answerAttempts?: AnswerAttemptEntity[]) {
    if (!answerAttempts?.length) return false;
    let isCorrect = true;
    const orderedAnswers = this.answers as OrderedAnswerEntity[];
    if (orderedAnswers.length !== answerAttempts.length) isCorrect = false;
    orderedAnswers.forEach(answer => {
      const attempt = answerAttempts.find(attempt => attempt?.answerId === answer?.id);
      if (!answer.isAnswerCorrect(attempt?.order)) isCorrect = false;
    });
    return isCorrect;
  }

  // Фронт устанавливает isCorrect для ассоциативного вопроса, потому что на фронте перемешиваются карточки ответов
  checkAssociativeAnswer(answerAttempts?: AnswerAttemptEntity[]) {
    if (!answerAttempts?.length) return false;
    let isCorrect = true;
    answerAttempts.forEach(attempt => {
      if (!attempt.isCorrect) isCorrect = false;
    });
    return isCorrect;
  }

  setComplexity(complexity: number) {
    this.complexity = complexity;
  }
}

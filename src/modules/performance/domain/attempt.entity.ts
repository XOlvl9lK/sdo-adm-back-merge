import { ChildEntity, Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, TableInheritance } from 'typeorm';
import { BaseEntity } from '@core/domain/base.entity';
import { UserEntity } from '@modules/user/domain/user.entity';
import { TestEntity } from '@modules/test/domain/test.entity';
import { TestQuestionEntity } from '@modules/test/domain/test-question.entity';
import { AnswerEntity } from '@modules/test/domain/answer.entity';
import { PerformanceEntity, PerformanceStatusEnum } from '@modules/performance/domain/performance.entity';
import { millisecondsToTime } from '@core/libs/milliseconds-to-time';
import { CourseEntity } from '@modules/course/domain/course.entity';

@Entity('attempt')
@TableInheritance({
  column: { type: 'text', name: 'type', comment: 'Тип попытки' },
})
export class AttemptEntity extends BaseEntity {
  @Column({
    type: 'text',
    nullable: true,
    comment: 'Время, затраченное на прохождение',
  })
  timeSpent: string;

  @ManyToOne(() => UserEntity, {
    cascade: true,
  })
  @JoinColumn()
  user?: UserEntity;

  @Column({ nullable: true, comment: 'ID пользователя' })
  userId?: string;

  @ManyToOne(() => PerformanceEntity, {
    cascade: true,
  })
  @JoinColumn({ name: 'performanceId' })
  performance?: PerformanceEntity;

  @Column({ comment: 'ID успеваемости' })
  performanceId: string;

  @Column({
    type: 'boolean',
    nullable: false,
    default: false,
    comment: 'Признак завершения',
  })
  isClosed: boolean;

  @Column({ type: 'text', default: 'В процессе', comment: 'Статус' })
  status: PerformanceStatusEnum;

  @Column({ type: 'int', default: 0, comment: 'Количество правильных баллов' })
  result: number;

  @Column({ type: 'timestamp', nullable: true, comment: 'Дата завершения' })
  endDate?: Date;

  constructor(user: UserEntity) {
    super();
    this.user = user;
    this.status = PerformanceStatusEnum.IN_PROGRESS
  }

  calculateTimeSpent() {
    this.timeSpent = millisecondsToTime(new Date().getTime() - this.createdAt.getTime());
  }

  endAttempt(timeSpent?: number) {
    if (timeSpent) {
      this.timeSpent = millisecondsToTime(timeSpent * 60 * 1000);
    } else {
      this.calculateTimeSpent();
    }
    this.endDate = new Date();
    this.isClosed = true;
  }
}

@ChildEntity()
export class TestAttemptEntity extends AttemptEntity {
  @ManyToOne(() => TestEntity, {
    cascade: true,
  })
  @JoinColumn()
  test: TestEntity;

  @Column({ comment: 'ID теста' })
  testId: string;

  @ManyToMany(() => TestQuestionAttemptEntity, {
    cascade: true,
  })
  @JoinTable()
  questionAttempts: TestQuestionAttemptEntity[];

  @Column({
    type: 'int',
    nullable: false,
    name: 'passing_score',
    comment: 'Минимальный балл для прохождения',
  })
  passingScore: number;

  constructor(user: UserEntity, test: TestEntity, passingScore: number, performance: PerformanceEntity) {
    super(user);
    this.test = test;
    this.passingScore = passingScore;
    this.performance = performance;
  }

  addQuestionAttempt(questionAttempt: TestQuestionAttemptEntity) {
    if (!this.questionAttempts) {
      this.questionAttempts = [questionAttempt];
    } else {
      this.questionAttempts.push(questionAttempt);
    }
  }

  makeAttempt(result: number, timeSpent?: number) {
    this.result = result;
    this.endAttempt(timeSpent);
    if (this.result >= this.passingScore) {
      this.status = PerformanceStatusEnum.PASSED;
    } else {
      this.status = PerformanceStatusEnum.FAILED;
    }
  }
}

@ChildEntity()
export class CourseAttemptEntity extends AttemptEntity {
  @ManyToOne(() => CourseEntity, {
    cascade: true,
  })
  @JoinColumn()
  course: CourseEntity;

  @Column({ comment: 'ID курса' })
  courseId: string;

  constructor(user: UserEntity, performance: PerformanceEntity, course: CourseEntity) {
    super(user);
    this.course = course;
    this.performance = performance;
    this.result = 50;
  }

  endCourse(scheduler?: boolean, timeSpent?: number) {
    if (!scheduler) {
      this.status = PerformanceStatusEnum.COMPLETED;
      this.result = 100;
    }
    this.endAttempt(timeSpent);
  }

  failCourse(timeSpent?: number) {
    this.status = PerformanceStatusEnum.NOT_FINISHED
    this.endAttempt(timeSpent)
  }
}

@Entity('test_question_attempt')
export class TestQuestionAttemptEntity extends BaseEntity {
  @ManyToOne(() => TestQuestionEntity, {
    cascade: true,
  })
  @JoinColumn({ name: 'questionId' })
  question: TestQuestionEntity;

  @Column({ comment: 'ID вопроса' })
  questionId: string;

  @ManyToMany(() => AnswerAttemptEntity, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  @JoinTable()
  answerAttempts: AnswerAttemptEntity[];

  @Column({ type: 'text', nullable: true, comment: 'ID темы' })
  themeId: string;

  constructor(question: TestQuestionEntity, themeId: string) {
    super();
    this.question = question;
    this.themeId = themeId;
  }
}

@Entity('answer_attempt')
export class AnswerAttemptEntity extends BaseEntity {
  @ManyToOne(() => AnswerEntity, {
    cascade: true,
  })
  @JoinColumn({ name: 'answerId' })
  answer: AnswerEntity;

  @Column({ comment: 'ID ответа' })
  answerId: string;

  @Column({ type: 'boolean', nullable: true, comment: 'Признак правильности' })
  isCorrect?: boolean;

  @Column({ type: 'text', nullable: true, comment: 'Определение' })
  definition?: string;

  @Column({ type: 'text', nullable: true, comment: 'Правильный ответ' })
  correctAnswer?: string;

  @Column({ type: 'int', nullable: true, comment: 'Порядок' })
  order?: number;

  constructor(answer: AnswerEntity, isCorrect?: boolean, definition?: string, correctAnswer?: string, order?: number) {
    super();
    this.answer = answer;
    this.isCorrect = isCorrect;
    this.definition = definition;
    this.correctAnswer = correctAnswer;
    this.order = order;
  }
}

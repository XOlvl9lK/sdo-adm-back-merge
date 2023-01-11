import { Column, Entity } from 'typeorm';
import { BaseEntity } from '@core/domain/base.entity';
import { ThemeInTestEntity } from '@modules/test/domain/test.entity';
import { each, filter, shuffle, sortBy } from 'lodash';
import { SavedQuestionsOrderEntity } from '@modules/performance/domain/saved-questions-order.entity';
import { TestQuestionTypesEnum } from '@modules/test/domain/test-question.entity';
import { getValidityDate } from '@core/libs/get-validity-date';

export enum QuestionDeliveryFormatEnum {
  ALL = 'ALL',
  LIMIT = 'LIMIT',
}

export enum QuestionSelectionTypeEnum {
  NEW = 'NEW',
  SINGLE = 'SINGLE',
}

export enum MixingTypeEnum {
  RANDOM = 'RANDOM',
  ORIGINAL = 'ORIGINAL',
}

@Entity('test_settings')
export class TestSettingsEntity extends BaseEntity {
  @Column({ type: 'int', default: 0, comment: 'Ограничение времени на тест' })
  timeLimit: number;

  @Column({ type: 'int', default: 0, comment: 'Допустимое кол-во попыток' })
  numberOfAttempts: number;

  @Column({ type: 'text', default: QuestionDeliveryFormatEnum.ALL, comment: 'Тип выдачи вопроса' })
  questionDeliveryFormat: QuestionDeliveryFormatEnum;

  @Column({ type: 'text', default: QuestionSelectionTypeEnum.NEW, comment: 'Тип выбора вопросов в вариант' })
  questionSelectionType: QuestionSelectionTypeEnum;

  @Column({ type: 'text', default: MixingTypeEnum.RANDOM, comment: 'Тип перемешивания вопросов в попытке' })
  questionMixingType: MixingTypeEnum;

  @Column({ type: 'text', default: MixingTypeEnum.RANDOM, comment: 'Тип перемешивания ответов в попытке' })
  answerMixingType: MixingTypeEnum;

  @Column({ type: 'boolean', default: false, comment: 'Открыть ответы пользователям' })
  isCorrectAnswersAvailable: boolean;

  @Column({ type: 'timestamp', nullable: true, comment: 'Дата, когда будут доступны правильные ответы' })
  correctAnswersAvailableDate?: Date;

  @Column({ type: 'int', default: 100, comment: 'Максимальный балл за тест' })
  maxScore: number;

  @Column({ type: 'int', default: 75, comment: 'Балл, который необходимо набрать для успешного прохождения теста' })
  passingScore: number;

  @Column({ type: 'boolean', default: true, comment: 'Обязательность' })
  isObligatory: boolean;

  @Column({ type: 'timestamp', nullable: true, name: 'start_date', comment: 'Дата начала действия теста' })
  startDate?: Date;

  @Column({ type: 'timestamp', nullable: true, name: 'end_date', comment: 'Дата окончания действия теста' })
  endDate?: Date;

  constructor(
    timeLimit?: number,
    numberOfAttempts?: number,
    questionDeliveryFormat?: QuestionDeliveryFormatEnum,
    questionSelectionType?: QuestionSelectionTypeEnum,
    questionMixingType?: MixingTypeEnum,
    answerMixingType?: MixingTypeEnum,
    isCorrectAnswersAvailable?: boolean,
    maxScore?: number,
    passingScore?: number,
    isObligatory?: boolean,
    correctAnswersAvailableDate?: Date,
    startDate?: string,
    endDate?: string,
  ) {
    super();
    this.timeLimit = timeLimit;
    this.numberOfAttempts = numberOfAttempts;
    this.questionDeliveryFormat = questionDeliveryFormat;
    this.questionSelectionType = questionSelectionType;
    this.questionMixingType = questionMixingType;
    this.answerMixingType = answerMixingType;
    this.isCorrectAnswersAvailable = isCorrectAnswersAvailable;
    this.correctAnswersAvailableDate = correctAnswersAvailableDate;
    this.maxScore = maxScore;
    this.passingScore = passingScore;
    this.isObligatory = isObligatory;
    this.startDate = getValidityDate('start', startDate);
    this.endDate = getValidityDate('end', endDate);
  }

  update(
    timeLimit?: number,
    numberOfAttempts?: number,
    questionDeliveryFormat?: QuestionDeliveryFormatEnum,
    questionSelectionType?: QuestionSelectionTypeEnum,
    questionMixingType?: MixingTypeEnum,
    answerMixingType?: MixingTypeEnum,
    isCorrectAnswersAvailable?: boolean,
    maxScore?: number,
    passingScore?: number,
    isObligatory?: boolean,
    correctAnswersAvailableDate?: Date,
    startDate?: string,
    endDate?: string,
  ) {
    this.timeLimit = timeLimit || 0;
    this.numberOfAttempts = numberOfAttempts || 0;
    this.questionDeliveryFormat = questionDeliveryFormat || QuestionDeliveryFormatEnum.ALL;
    this.questionSelectionType = questionSelectionType || QuestionSelectionTypeEnum.NEW;
    this.questionMixingType = questionMixingType || MixingTypeEnum.RANDOM;
    this.answerMixingType = answerMixingType || MixingTypeEnum.RANDOM;
    this.isCorrectAnswersAvailable = isCorrectAnswersAvailable ?? false;
    this.correctAnswersAvailableDate = correctAnswersAvailableDate;
    this.maxScore = maxScore || 100;
    this.passingScore = passingScore || 0;
    this.isObligatory = isObligatory ?? true;
    this.startDate = getValidityDate('start', startDate);
    this.endDate = getValidityDate('end', endDate);
  }

  limitQuestions(testThemes: ThemeInTestEntity[], isNewAttempt?: boolean) {
    each(testThemes, themeInTest => {
      themeInTest.theme.questions = filter(themeInTest.theme.questions, question => !question.question.isArchived);
      if (this.questionDeliveryFormat === QuestionDeliveryFormatEnum.LIMIT) {
        if (this.questionSelectionType === QuestionSelectionTypeEnum.NEW && isNewAttempt) {
          themeInTest.theme.questions = shuffle(themeInTest.theme.questions)
        }
        if (themeInTest.theme.questionsToDisplay > 0) {
          themeInTest.theme.questions = themeInTest.theme.questions.slice(0, themeInTest.theme.questionsToDisplay);
        }
      }
    })
  }

  prepareQuestions(testThemes: ThemeInTestEntity[], savedQuestionsOrder?: SavedQuestionsOrderEntity[]) {
    const savedQuestionsInThemeOrder: SavedQuestionsInThemeOrder[] = [];
    this.limitQuestions(testThemes, !savedQuestionsOrder?.length);
    if (this.questionSelectionType === QuestionSelectionTypeEnum.SINGLE && savedQuestionsOrder?.length) {
      this.shuffleQuestionsBySavedOrder(testThemes, savedQuestionsOrder);
    } else if (this.questionMixingType === MixingTypeEnum.RANDOM) {
      testThemes.forEach(themeInTest => {
        themeInTest.theme.questions = shuffle(themeInTest.theme.questions);
        savedQuestionsInThemeOrder.push({
          themeId: themeInTest.theme.id,
          questionsOrder: themeInTest.theme.questions.map(q => q.question.id),
        });
      });
    } else {
      testThemes.forEach(themeInTest => {
        themeInTest.theme.questions = sortBy(themeInTest.theme.questions, 'order');
        savedQuestionsInThemeOrder.push({
          themeId: themeInTest.theme.id,
          questionsOrder: themeInTest.theme.questions.map(q => q.question.id),
        });
      });
    }
    return savedQuestionsInThemeOrder;
  }

  shuffleQuestionsBySavedOrder(testThemes: ThemeInTestEntity[], savedQuestionsOrder?: SavedQuestionsOrderEntity[]) {
    this.limitQuestions(testThemes);
    if (savedQuestionsOrder?.length) {
      testThemes.forEach(themeInTest => {
        const savedOrder = savedQuestionsOrder.find(
          saved => saved.testThemeId === themeInTest.theme.id,
        )?.questionsOrder;
        const restQuestions = themeInTest.theme.questions.filter(q => !savedOrder?.includes(q.question.id));
        if (savedOrder?.length) {
          const ordered = [];
          savedOrder.forEach(saved => {
            const question = themeInTest.theme.questions.find(q => q.question.id === saved);
            if (question) {
              ordered.push(question);
            }
          });
          ordered.push(...restQuestions);
          themeInTest.theme.questions = ordered;
        }
      });
    }
  }

  shuffleAnswers(testThemes: ThemeInTestEntity[]) {
    each(testThemes, themeInTest => {
      each(themeInTest.theme.questions, questionInTheme => {
        if (this.answerMixingType === MixingTypeEnum.RANDOM || questionInTheme.question.type === TestQuestionTypesEnum.ORDERED) {
          questionInTheme.question.answers = shuffle(questionInTheme.question.answers);
        }
      })
    })
  }

  isTimeIsOver(attemptCreateDate: Date) {
    if (this.timeLimit === 0) return false;
    const timeSpent = new Date().getTime() - new Date(attemptCreateDate).getTime();
    return this.timeLimit * 60 * 1000 - timeSpent < 0;
  }
}

interface SavedQuestionsInThemeOrder {
  themeId: string;
  questionsOrder: string[];
}

import { AnswerAttemptEntity, TestQuestionAttemptEntity } from '@modules/performance/domain/attempt.entity';
import { TestQuestionTypesEnum } from '@modules/test/domain/test-question.entity';
import { TestSettingsEntity } from '@modules/education-program/domain/test-settings.entity';

export class CheckTestHelper {
  static getAllAnswerAttempts(questionAttempts: TestQuestionAttemptEntity[]) {
    const answerAttempts: AnswerAttemptEntity[] = [];
    questionAttempts.forEach(attempt => {
      answerAttempts.push(...attempt.answerAttempts);
    });
    return answerAttempts;
  }

  static calculateTestResult(
    questionAttempts: TestQuestionAttemptEntity[],
    settings: TestSettingsEntity,
    totalQuestions: number,
  ) {
    if (!questionAttempts.length) return 0;
    let correctQuestions = 0;
    questionAttempts.forEach(attempt => {
      const question = attempt.question;
      const answerAttempts = attempt.answerAttempts;
      let isCorrect = false;
      switch (question?.type) {
        case TestQuestionTypesEnum.SINGLE:
          if (question.checkSingleAnswer(answerAttempts[0])) isCorrect = true;
          break;
        case TestQuestionTypesEnum.MULTIPLE:
          if (question.checkMultipleAnswer(answerAttempts)) isCorrect = true;
          break;
        case TestQuestionTypesEnum.OPEN:
          if (question.checkOpenAnswer(answerAttempts[0])) isCorrect = true;
          break;
        case TestQuestionTypesEnum.ORDERED:
          if (question.checkOrderedAnswer(answerAttempts)) isCorrect = true;
          break;
        case TestQuestionTypesEnum.ASSOCIATIVE:
          if (question.checkAssociativeAnswer(answerAttempts)) isCorrect = true;
          break;
      }
      if (isCorrect) correctQuestions++;
    });
    return Math.round((settings.maxScore / totalQuestions) * correctQuestions);
  }
}

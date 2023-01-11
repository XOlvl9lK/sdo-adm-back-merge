import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  QuestionInThemeRepository,
  TestQuestionRepository,
} from '@modules/test/infrastructure/database/test-question.repository';
import { QuestionException } from '@modules/test/infrastructure/exceptions/question.exception';
import { SubmitManyQuestionDto, SubmitQuestionDto } from '@modules/test/controllers/dtos/submit-question.dto';
import { UserRepository } from '@modules/user/infrastructure/database/user.repository';
import { TestRepository } from '@modules/test/infrastructure/database/test.repository';
import { TestPerformanceRepository } from '@modules/performance/infrastructure/database/performance.repository';
import {
  AnswerAttemptRepository,
  TestAttemptRepository,
  TestQuestionAttemptRepository,
} from '@modules/performance/infrastructure/database/attempt.repository';
import { TestException } from '@modules/test/infrastructure/exceptions/test.exception';
import { PerformanceException } from '@modules/performance/infrastructure/exceptions/performance.exception';
import { AnswerAttemptEntity, TestQuestionAttemptEntity } from '@modules/performance/domain/attempt.entity';
import { AnswerRepository } from '@modules/test/infrastructure/database/answer.repository';
import { AnswerEntity } from '@modules/test/domain/answer.entity';

@Injectable()
export class SubmitQuestionService {
  constructor(
    @InjectRepository(TestQuestionRepository)
    private testQuestionRepository: TestQuestionRepository,
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    @InjectRepository(TestRepository)
    private testRepository: TestRepository,
    @InjectRepository(TestPerformanceRepository)
    private testPerformanceRepository: TestPerformanceRepository,
    @InjectRepository(TestQuestionAttemptRepository)
    private testQuestionAttemptRepository: TestQuestionAttemptRepository,
    @InjectRepository(TestAttemptRepository)
    private testAttemptRepository: TestAttemptRepository,
    @InjectRepository(AnswerRepository)
    private answerRepository: AnswerRepository<AnswerEntity>,
    @InjectRepository(AnswerAttemptRepository)
    private answerAttemptRepository: AnswerAttemptRepository,
    @InjectRepository(QuestionInThemeRepository)
    private questionInThemeRepository: QuestionInThemeRepository,
  ) {}

  async submit({ questionInThemeId, testId, performanceId, submittedAnswers, questionId }: SubmitQuestionDto) {
    const [test, questionInTheme, testPerformance] = await Promise.all([
      this.testRepository.findById(testId),
      this.questionInThemeRepository.findByQuestionIdAndQuestionInThemeId(questionId, questionInThemeId),
      this.testPerformanceRepository.findByIdWithLastAttempt(performanceId),
    ]);
    if (!questionInTheme) QuestionException.NotFound();
    if (!test) TestException.NotFound();
    if (!testPerformance) PerformanceException.NotFound();
    const testAttempt = testPerformance.lastAttempt;
    if (!testAttempt) return;
    let questionAttempt = testAttempt?.questionAttempts.find(attempt => attempt.questionId === questionId);
    if (!questionAttempt) {
      questionAttempt = new TestQuestionAttemptEntity(questionInTheme.question, questionInTheme.theme.id);
    } else {
      const answerAttempts = questionAttempt.answerAttempts;
      await this.answerAttemptRepository.remove(answerAttempts);
    }

    const newAnswerAttempts = await Promise.all(
      submittedAnswers.map(answer =>
        this.answerRepository
          .findById(answer.answerId)
          .then(
            answerEntity =>
              new AnswerAttemptEntity(
                answerEntity,
                answer?.isCorrect,
                answer?.definition,
                answer?.correctAnswer,
                answer?.order,
              ),
          ),
      ),
    );

    await this.answerAttemptRepository.save(newAnswerAttempts);
    questionAttempt.answerAttempts = newAnswerAttempts;
    await this.testQuestionAttemptRepository.save(questionAttempt);
    testAttempt?.addQuestionAttempt(questionAttempt);
    await this.testAttemptRepository.save(testAttempt);

    return { success: true };
  }

  async submitMany({ submittedQuestions }: SubmitManyQuestionDto) {
    for (let i = 0; i < submittedQuestions.length; i++) {
      await this.submit(submittedQuestions[i]);
    }
    return { success: true };
  }
}

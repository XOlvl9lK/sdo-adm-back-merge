import { forwardRef, Module } from '@nestjs/common';
import { TestController } from 'src/modules/test/controllers/test.controller';
import { QuestionController } from '@modules/test/controllers/question.controller';
import { CreateAnswerService } from '@modules/test/application/create-answer.service';
import { CreateQuestionService } from '@modules/test/application/create-question.service';
import { SubmitQuestionService } from '@modules/test/application/submit-question.service';
import { CreateTestService } from '@modules/test/application/create-test.service';
import { FindTestService } from '@modules/test/application/find-test.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  QuestionInThemeRepository,
  TestQuestionRepository,
} from '@modules/test/infrastructure/database/test-question.repository';
import {
  AssociativeAnswerRepository,
  SingleAnswerRepository,
  OrderedAnswerRepository,
  MultipleAnswerRepository,
  OpenAnswerRepository,
  AnswerRepository,
} from '@modules/test/infrastructure/database/answer.repository';
import { TestRepository } from '@modules/test/infrastructure/database/test.repository';
import { CourseRepository } from '@modules/course/infrastructure/database/course.repository';
import { EducationProgramRepository } from '@modules/education-program/infrastructure/database/education-program.repository';
import { DeleteTestService } from '@modules/test/application/delete-test.service';
import {
  EducationRequestRepository,
  UserEducationRequestRepository,
} from '@modules/education-request/infrastructure/database/education-request.repository';
import {
  AnswerAttemptRepository,
  AttemptRepository,
  TestAttemptRepository,
  TestQuestionAttemptRepository,
} from '@modules/performance/infrastructure/database/attempt.repository';
import {
  EducationProgramPerformanceRepository,
  PerformanceRepository,
  TestPerformanceRepository,
} from '@modules/performance/infrastructure/database/performance.repository';
import { UserRepository } from '@modules/user/infrastructure/database/user.repository';
import { SubmitTestService } from '@modules/test/application/submit-test.service';
import {
  TestThemeRepository,
  ThemeInTestRepository,
} from '@modules/test/infrastructure/database/test-theme.repository';
import { CreateTestThemeService } from '@modules/test/application/create-test-theme.service';
import { TestThemeController } from '@modules/test/controllers/test-theme.controller';
import { FindTestThemeService } from '@modules/test/application/find-test-theme.service';
import { FindQuestionService } from '@modules/test/application/find-question.service';
import { UpdateTestThemeService } from '@modules/test/application/update-test-theme.service';
import { ChapterRepository } from '@modules/chapter/infrastructure/database/chapter.repository';
import { UpdateTestService } from '@modules/test/application/update-test.service';
import { UpdateQuestionService } from '@modules/test/application/update-question.service';
import { SavedQuestionsOrderRepository } from '@modules/performance/infrastructure/database/saved-questions-order.repository';
import { RunTestService } from '@modules/test/application/run-test.service';
import { CreateSavedQuestionsOrderService } from '@modules/test/application/create-saved-questions-order.service';
import { TestAttemptSessionService } from '@modules/test/application/test-attempt-session.service';
import { ChapterModule } from '@modules/chapter/chapter.module';
import { AssignmentRepository } from '@modules/education-request/infrastructure/database/assignment.repository';
import { ProgramElementRepository } from '@modules/education-program/infrastructure/database/program-element.repository';
import { PerformanceModule } from '@modules/performance/performance.module';

@Module({
  controllers: [TestController, QuestionController, TestThemeController],
  providers: [
    CreateAnswerService,
    CreateQuestionService,
    SubmitQuestionService,
    CreateTestService,
    FindTestService,
    DeleteTestService,
    SubmitTestService,
    CreateTestThemeService,
    FindTestThemeService,
    FindQuestionService,
    UpdateTestThemeService,
    UpdateTestService,
    UpdateQuestionService,
    RunTestService,
    CreateSavedQuestionsOrderService,
    TestAttemptSessionService,
  ],
  imports: [
    TypeOrmModule.forFeature([
      TestQuestionRepository,
      SingleAnswerRepository,
      AssociativeAnswerRepository,
      OrderedAnswerRepository,
      TestRepository,
      CourseRepository,
      EducationProgramRepository,
      EducationRequestRepository,
      TestAttemptRepository,
      MultipleAnswerRepository,
      OpenAnswerRepository,
      TestPerformanceRepository,
      AnswerAttemptRepository,
      UserRepository,
      TestQuestionAttemptRepository,
      AnswerRepository,
      UserEducationRequestRepository,
      TestThemeRepository,
      ChapterRepository,
      ThemeInTestRepository,
      QuestionInThemeRepository,
      SavedQuestionsOrderRepository,
      EducationProgramPerformanceRepository,
      PerformanceRepository,
      AttemptRepository,
      AssignmentRepository,
      ProgramElementRepository,
    ]),
    ChapterModule,
    forwardRef(() => PerformanceModule)
  ],
  exports: [SubmitTestService],
})
export class TestModule {}

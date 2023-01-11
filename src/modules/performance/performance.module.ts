import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreatePerformanceService } from '@modules/performance/application/create-performance.service';
import { UserRepository } from '@modules/user/infrastructure/database/user.repository';
import { TestRepository } from '@modules/test/infrastructure/database/test.repository';
import { TestQuestionRepository } from '@modules/test/infrastructure/database/test-question.repository';
import {
  CoursePerformanceRepository,
  EducationProgramPerformanceRepository,
  PerformanceRepository,
  TestPerformanceRepository,
} from '@modules/performance/infrastructure/database/performance.repository';
import {
  AttemptRepository,
  CourseAttemptRepository,
  TestAttemptRepository,
  TestQuestionAttemptRepository,
} from '@modules/performance/infrastructure/database/attempt.repository';
import { CourseRepository } from '@modules/course/infrastructure/database/course.repository';
import { FindPerformanceService } from '@modules/performance/application/find-performance.service';
import { PerformanceController } from '@modules/performance/controllers/performance.controller';
import { EducationRequestAcceptEventHandler } from '@modules/performance/application/education-request-accept.event-handler';
import { GroupRepository } from '@modules/group/infrastructure/database/group.repository';
import {
  EducationElementRepository,
  EducationProgramRepository,
} from '@modules/education-program/infrastructure/database/education-program.repository';
import { AssignmentRepository } from '@modules/education-request/infrastructure/database/assignment.repository';
import { SavedQuestionsOrderRepository } from '@modules/performance/infrastructure/database/saved-questions-order.repository';
import { TestThemeRepository } from '@modules/test/infrastructure/database/test-theme.repository';
import { EducationRequestGroupEnrollEventHandler } from '@modules/performance/application/education-request-group-enroll.event-handler';
import { AttemptsSchedulerService } from '@modules/performance/application/attempts-scheduler.service';
import { TestModule } from '@modules/test/test.module';
import { CourseModule } from '@modules/course/course.module';
import { GeneratePerformanceCertificateService } from 'src/modules/performance/application/generate-perfomance-certificate.service';
import { GroupChangesEventHandler } from '@modules/performance/application/group-changes.event-handler';
import { UpdateProgramPerformanceService } from '@modules/performance/application/update-program-performance.service';
import { MessengerModule } from '@modules/messenger/messenger.module';

@Module({
  controllers: [PerformanceController],
  imports: [
    TypeOrmModule.forFeature([
      UserRepository,
      TestRepository,
      TestQuestionRepository,
      TestPerformanceRepository,
      TestQuestionAttemptRepository,
      TestAttemptRepository,
      CoursePerformanceRepository,
      CourseRepository,
      PerformanceRepository,
      GroupRepository,
      EducationProgramPerformanceRepository,
      EducationProgramRepository,
      EducationElementRepository,
      AssignmentRepository,
      CourseAttemptRepository,
      SavedQuestionsOrderRepository,
      TestThemeRepository,
      AttemptRepository,
    ]),
    forwardRef(() => TestModule),
    forwardRef(() => CourseModule),
    MessengerModule
  ],
  providers: [
    CreatePerformanceService,
    FindPerformanceService,
    EducationRequestAcceptEventHandler,
    EducationRequestGroupEnrollEventHandler,
    AttemptsSchedulerService,
    GeneratePerformanceCertificateService,
    GroupChangesEventHandler,
    UpdateProgramPerformanceService
  ],
  exports: [UpdateProgramPerformanceService]
})
export class PerformanceModule {}

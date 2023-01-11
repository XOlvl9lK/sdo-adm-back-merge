import { Module } from '@nestjs/common';
import { FileModule } from 'src/modules/file/file.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  CoursePerformanceRepository,
  EducationProgramPerformanceRepository,
  PerformanceRepository,
} from '@modules/performance/infrastructure/database/performance.repository';
import { RegisteredUsersController } from '@modules/control/controllers/registered-users.controller';
import { UserRepository } from '@modules/user/infrastructure/database/user.repository';
import { RegisteredUsersService } from '@modules/control/application/registered-users.service';
import { SessionController } from '@modules/control/controllers/session.controller';
import { SessionRepository } from '@modules/user/infrastructure/database/session.repository';
import { SessionService } from '@modules/control/application/session.service';
import { UserPeriodPerformanceController } from '@modules/control/controllers/user-period-performance.controller';
import { UserPeriodPerformanceService } from '@modules/control/application/user-period-performance.service';
import { GroupRepository, UserInGroupRepository } from '@modules/group/infrastructure/database/group.repository';
import { AttemptRepository } from '@modules/performance/infrastructure/database/attempt.repository';
import { UserProgramPerformanceController } from '@modules/control/controllers/user-program-performance.controller';
import { UserProgramPerformanceService } from '@modules/control/application/user-program-performance.service';
import {
  EducationElementRepository,
  EducationProgramRepository,
} from '@modules/education-program/infrastructure/database/education-program.repository';
import { GroupProgramPerformanceController } from '@modules/control/controllers/group-program-performance.controller';
import { GroupProgramPerformanceService } from '@modules/control/application/group-program-performance.service';
import { ReportUserController } from '@modules/control/controllers/report-user.controller';
import { ReportUserService } from '@modules/control/application/report-user.service';
import { RegisteredReportPerformanceController } from '@modules/control/controllers/registered-report-performance.controller';
import { RegisteredReportPerformanceService } from '@modules/control/application/registered-report-performance.service';
import { UserPerformanceController } from '@modules/control/controllers/user-performance.controller';
import { UserPerformanceService } from '@modules/control/application/user-performance.service';
import { OpenSessionController } from '@modules/control/controllers/open-session.controller';
import { OpenSessionService } from '@modules/control/application/open-session.service';
import {
  DepartmentRepository,
  SubdivisionRepository,
} from '@modules/authority/infrastructure/database/authority.repository';
import { CourseRepository } from '@modules/course/infrastructure/database/course.repository';
import { ExportTaskModule } from '@modules/export-task/export-task.module';
import { ExportTaskRepository } from '@modules/export-task/infrastructure/export-task.repository';
import { ControlRepository } from 'src/modules/control/infrastructure/database/control.repository';

@Module({
  imports: [
    FileModule,
    TypeOrmModule.forFeature([
      CoursePerformanceRepository,
      UserRepository,
      SessionRepository,
      PerformanceRepository,
      GroupRepository,
      AttemptRepository,
      EducationElementRepository,
      UserInGroupRepository,
      EducationProgramPerformanceRepository,
      DepartmentRepository,
      SubdivisionRepository,
      CourseRepository,
      EducationProgramRepository,
      ExportTaskRepository
    ]),
    ExportTaskModule
  ],
  controllers: [
    RegisteredUsersController,
    SessionController,
    UserPeriodPerformanceController,
    UserProgramPerformanceController,
    GroupProgramPerformanceController,
    ReportUserController,
    RegisteredReportPerformanceController,
    UserPerformanceController,
    OpenSessionController,
  ],
  providers: [
    ControlRepository,
    RegisteredUsersService,
    SessionService,
    UserPeriodPerformanceService,
    UserProgramPerformanceService,
    GroupProgramPerformanceService,
    ReportUserService,
    RegisteredReportPerformanceService,
    UserPerformanceService,
    OpenSessionService,
  ],
})
export class ControlModule {}

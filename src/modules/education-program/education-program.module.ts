import { Module } from '@nestjs/common';
import { EducationProgramController } from 'src/modules/education-program/controllers/education-program.controller';
import { CreateEducationProgramService } from '@modules/education-program/application/create-education-program.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  EducationElementRepository,
  EducationProgramRepository,
} from '@modules/education-program/infrastructure/database/education-program.repository';
import { FindEducationProgramService } from '@modules/education-program/application/find-education-program.service';
import { DeleteEducationProgramService } from '@modules/education-program/application/delete-education-program.service';
import { ProgramElementController } from '@modules/education-program/controllers/program-element.controller';
import { FindProgramElementService } from '@modules/education-program/application/find-program-element.service';
import { ChapterRepository } from '@modules/chapter/infrastructure/database/chapter.repository';
import { SettingsController } from '@modules/education-program/controllers/settings.controller';
import { CreateTestSettingsService } from '@modules/education-program/application/create-test-settings.service';
import { TestSettingsRepository } from '@modules/education-program/infrastructure/database/test-settings.repository';
import { CreateProgramElementService } from '@modules/education-program/application/create-program-element.service';
import { FindTestSettingsService } from '@modules/education-program/application/find-test-settings.service';
import { ChangeProgramElementOrder } from 'src/modules/education-program/application/change-program-element-order.service';
import { UpdateTestSettingsService } from '@modules/education-program/application/update-test-settings.service';
import { CreateCourseSettingsService } from '@modules/education-program/application/create-course-settings.service';
import { CourseSettingsRepository } from '@modules/education-program/infrastructure/database/course-settings.repository';
import { UpdateCourseSettingsService } from '@modules/education-program/application/update-course-settings.service';
import { FindCourseSettingsService } from '@modules/education-program/application/find-course-settings.service';
import { UpdateEducationProgramService } from '@modules/education-program/application/update-education-program.service';
import { ProgramElementRepository } from '@modules/education-program/infrastructure/database/program-element.repository';
import { EducationElementController } from '@modules/education-program/controllers/education-element.controller';
import { FindEducationElementService } from '@modules/education-program/application/find-education-element.service';
import { EducationProgramSettingsRepository } from '@modules/education-program/infrastructure/database/education-program-settings.repository';
import { CreateEducationProgramSettingsService } from '@modules/education-program/application/create-education-program-settings.service';
import { FindEducationProgramSettingsService } from '@modules/education-program/application/find-education-program-settings.service';
import { UpdateEducationProgramSettingsService } from '@modules/education-program/application/update-education-program-settings.service';
import { AssignmentRepository } from '@modules/education-request/infrastructure/database/assignment.repository';
import { ChapterModule } from '@modules/chapter/chapter.module';
import { UserEducationRequestRepository } from '@modules/education-request/infrastructure/database/education-request.repository';
import { ThemeInTestRepository } from '@modules/test/infrastructure/database/test-theme.repository';
import { ProgramSettingRepository } from '@modules/program-settings/infrastructure/database/program-setting.repository';

@Module({
  controllers: [EducationProgramController, ProgramElementController, SettingsController, EducationElementController],
  providers: [
    CreateEducationProgramService,
    FindEducationProgramService,
    DeleteEducationProgramService,
    FindProgramElementService,
    CreateTestSettingsService,
    CreateProgramElementService,
    FindTestSettingsService,
    ChangeProgramElementOrder,
    UpdateTestSettingsService,
    CreateCourseSettingsService,
    UpdateCourseSettingsService,
    FindCourseSettingsService,
    UpdateEducationProgramService,
    FindEducationElementService,
    CreateEducationProgramSettingsService,
    FindEducationProgramSettingsService,
    UpdateEducationProgramSettingsService,
  ],
  imports: [
    TypeOrmModule.forFeature([
      EducationProgramRepository,
      EducationElementRepository,
      ProgramElementRepository,
      ChapterRepository,
      TestSettingsRepository,
      CourseSettingsRepository,
      ProgramElementRepository,
      EducationProgramSettingsRepository,
      AssignmentRepository,
      UserEducationRequestRepository,
      ThemeInTestRepository,
      ProgramSettingRepository
    ]),
    ChapterModule,
  ],
  exports: [CreateTestSettingsService, CreateCourseSettingsService, CreateEducationProgramSettingsService],
})
export class EducationProgramModule {}

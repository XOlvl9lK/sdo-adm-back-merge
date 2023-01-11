import { forwardRef, Module } from '@nestjs/common';
import { CreateCourseService } from '@modules/course/application/create-course.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseRepository } from '@modules/course/infrastructure/database/course.repository';
import { EducationProgramRepository } from '@modules/education-program/infrastructure/database/education-program.repository';
import { CourseController } from '@modules/course/controllers/course.controller';
import { FindCourseService } from '@modules/course/application/find-course.service';
import { DeleteCourseService } from '@modules/course/application/delete-course.service';
import {
  EducationRequestRepository,
  UserEducationRequestRepository,
} from '@modules/education-request/infrastructure/database/education-request.repository';
import { ChapterRepository } from '@modules/chapter/infrastructure/database/chapter.repository';
import { FileModule } from '@modules/file/file.module';
import { UpdateCourseService } from 'src/modules/course/application/update-course.service';
import { ScormCourseService } from 'src/modules/course/infrastructure/scorm-course.service';
import { SubmitCourseService } from '@modules/course/application/submit-course.service';
import {
  CoursePerformanceRepository,
  EducationProgramPerformanceRepository,
  PerformanceRepository,
} from '@modules/performance/infrastructure/database/performance.repository';
import { CourseAttemptRepository } from '@modules/performance/infrastructure/database/attempt.repository';
import { CourseSuspendDataController } from '@modules/course/controllers/course-suspend-data.controller';
import { CourseSuspendDataService } from '@modules/course/application/course-suspend-data.service';
import { CourseSuspendDataRepository } from '@modules/course/infrastructure/database/course-suspend-data.repository';
import { RenderCourseController } from '@modules/course/controllers/render-course.controller';
import { UserRepository } from '@modules/user/infrastructure/database/user.repository';
import { RunCourseService } from '@modules/course/application/run-course.service';
import { ChapterModule } from '@modules/chapter/chapter.module';
import { AssignmentRepository } from '@modules/education-request/infrastructure/database/assignment.repository';
import { PerformanceModule } from '@modules/performance/performance.module';

@Module({
  providers: [
    CreateCourseService,
    FindCourseService,
    DeleteCourseService,
    UpdateCourseService,
    ScormCourseService,
    SubmitCourseService,
    CourseSuspendDataService,
    RunCourseService,
  ],
  controllers: [CourseController, CourseSuspendDataController, RenderCourseController],
  imports: [
    FileModule,
    TypeOrmModule.forFeature([
      CourseRepository,
      EducationProgramRepository,
      EducationRequestRepository,
      UserEducationRequestRepository,
      ChapterRepository,
      CoursePerformanceRepository,
      CourseAttemptRepository,
      CourseSuspendDataRepository,
      UserRepository,
      EducationProgramPerformanceRepository,
      PerformanceRepository,
      AssignmentRepository,
    ]),
    ChapterModule,
    forwardRef(() => PerformanceModule)
  ],
  exports: [SubmitCourseService],
})
export class CourseModule {}

import { Module } from '@nestjs/common';
import { EducationRequestController } from '@modules/education-request/controllers/education-request.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  EducationRequestRepository,
  GroupEducationRequestRepository,
  UserEducationRequestRepository,
} from '@modules/education-request/infrastructure/database/education-request.repository';
import {
  EducationElementRepository,
  EducationProgramRepository,
} from '@modules/education-program/infrastructure/database/education-program.repository';
import { UserRepository } from '@modules/user/infrastructure/database/user.repository';
import { CreateEducationRequestService } from '@modules/education-request/application/create-education-request.service';
import { FindEducationRequestService } from '@modules/education-request/application/find-education-request.service';
import { UpdateEducationRequestService } from '@modules/education-request/application/update-education-request.service';
import { GroupRepository } from '@modules/group/infrastructure/database/group.repository';
import { AssignmentRepository } from '@modules/education-request/infrastructure/database/assignment.repository';
import { AssignmentController } from '@modules/education-request/controllers/assignment.controller';
import { CreateAssignmentService } from '@modules/education-request/application/create-assignment.service';
import { TestRepository } from '@modules/test/infrastructure/database/test.repository';
import { CourseRepository } from '@modules/course/infrastructure/database/course.repository';
import { FindAssignmentService } from '@modules/education-request/application/find-assignment.service';
import { EducationProgramModule } from '@modules/education-program/education-program.module';
import { DeleteEducationRequestService } from '@modules/education-request/application/delete-education-request.service';
import { RoleDibRepository } from '@modules/authority/infrastructure/database/authority.repository';
import { ProgramSettingRepository } from '@modules/program-settings/infrastructure/database/program-setting.repository';
import { ExecuteAssignmentsMessagesDeliveryService } from '@modules/education-request/application/execute-assignments-messages-delivery.service';
import { WorkerModule } from '@modules/worker/worker.module';

@Module({
  controllers: [EducationRequestController, AssignmentController],
  imports: [
    TypeOrmModule.forFeature([
      EducationRequestRepository,
      EducationElementRepository,
      GroupEducationRequestRepository,
      UserEducationRequestRepository,
      UserRepository,
      GroupRepository,
      AssignmentRepository,
      EducationProgramRepository,
      TestRepository,
      CourseRepository,
      RoleDibRepository,
      ProgramSettingRepository,
    ]),
    EducationProgramModule,
    WorkerModule
  ],
  providers: [
    CreateEducationRequestService,
    FindEducationRequestService,
    UpdateEducationRequestService,
    CreateAssignmentService,
    FindAssignmentService,
    DeleteEducationRequestService,
    ExecuteAssignmentsMessagesDeliveryService,
  ],
})
export class EducationRequestModule {}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AssignmentRepository } from '@modules/education-request/infrastructure/database/assignment.repository';
import { CreateAssignmentDto, EnrollManyDto } from '@modules/education-request/controllers/dtos/create-assignment.dto';
import { EducationElementRepository } from '@modules/education-program/infrastructure/database/education-program.repository';
import { UserRepository } from '@modules/user/infrastructure/database/user.repository';
import { GroupRepository } from '@modules/group/infrastructure/database/group.repository';
import { AssignmentEntity } from '@modules/education-request/domain/assignment.entity';
import { CreateTestSettingsService } from '@modules/education-program/application/create-test-settings.service';
import { CreateCourseSettingsService } from '@modules/education-program/application/create-course-settings.service';
import { EducationElementTypeEnum } from '@modules/education-program/domain/education-element.entity';
import { CreateEducationProgramSettingsService } from '@modules/education-program/application/create-education-program-settings.service';
import { EducationRequestOwnerTypeEnum } from '@modules/education-request/domain/education-request.entity';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { EventActionEnum } from '@modules/event/application/create-event.service';
import { ObligatoryUpdatedEvent } from '@modules/event/infrastructure/events/obligatory-updated.event';
import { RoleDibRepository } from '@modules/authority/infrastructure/database/authority.repository';
import { CreatePerformanceOnProgramSettingsUpdatedEvent } from '@modules/event/infrastructure/events/create-performance-on-program-settings-updated.event';
import { DibUsersImportEvent } from '@modules/event/infrastructure/events/dib-users-import.event';
import { ProgramSettingRepository } from '@modules/program-settings/infrastructure/database/program-setting.repository';
import { ExecuteAssignmentsMessagesDeliveryService } from '@modules/education-request/application/execute-assignments-messages-delivery.service';
import { flatten, uniqBy } from 'lodash';
import { WorkerService } from '@modules/worker/application/worker.service';

@Injectable()
export class CreateAssignmentService {
  constructor(
    @InjectRepository(AssignmentRepository)
    private assignmentRepository: AssignmentRepository,
    @InjectRepository(EducationElementRepository)
    private educationElementRepository: EducationElementRepository,
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    @InjectRepository(GroupRepository)
    private groupRepository: GroupRepository,
    @InjectRepository(RoleDibRepository)
    private roleDibRepository: RoleDibRepository,
    @InjectRepository(ProgramSettingRepository)
    private programSettingsRepository: ProgramSettingRepository,
    private createTestSettingsService: CreateTestSettingsService,
    private createCourseSettingsService: CreateCourseSettingsService,
    private createEducationProgramSettingsService: CreateEducationProgramSettingsService,
    private eventEmitter: EventEmitter2,
    private executeAssignmentsMessagesDeliveryService: ExecuteAssignmentsMessagesDeliveryService,
    private workerService: WorkerService
  ) {}

  async create({
    ownerType,
    userId,
    groupId,
    educationElementId,
    programSettings,
    courseSettings,
    testSettings,
    validityFrom,
    validityTo,
    isObligatory,
    certificateIssuance,
  }: CreateAssignmentDto): Promise<AssignmentEntity> {
    const [user, group, educationElement] = await Promise.all([
      this.userRepository.findById(userId),
      this.groupRepository.findById(groupId),
      this.educationElementRepository.findById(educationElementId),
    ]);
    let settings;
    let assignment;
    switch (educationElement.elementType) {
      case EducationElementTypeEnum.TEST:
        settings = await this.createTestSettingsService.create({
          isObligatory,
          ...testSettings,
          timeLimit: testSettings?.timeLimit ?? educationElement.duration,
          startDate: validityFrom,
          endDate: validityTo,
        });
        assignment = new AssignmentEntity(
          ownerType,
          educationElement,
          user,
          group,
          settings,
          null,
          null,
          validityFrom,
          validityTo,
          isObligatory,
          certificateIssuance,
        );
        return await this.assignmentRepository.save(assignment);
      case EducationElementTypeEnum.COURSE:
        settings = await this.createCourseSettingsService.create({
          isObligatory,
          ...courseSettings,
          timeLimit: courseSettings?.timeLimit ?? educationElement.duration,
          startDate: validityFrom,
          endDate: validityTo,
        });
        assignment = new AssignmentEntity(
          ownerType,
          educationElement,
          user,
          group,
          null,
          settings,
          null,
          validityFrom,
          validityTo,
          isObligatory,
          certificateIssuance,
        );
        return await this.assignmentRepository.save(assignment);
      case EducationElementTypeEnum.PROGRAM:
        settings = await this.createEducationProgramSettingsService.create({
          isObligatory,
          ...programSettings,
          startDate: validityFrom,
          endDate: validityTo,
        });
        assignment = new AssignmentEntity(
          ownerType,
          educationElement,
          user,
          group,
          null,
          null,
          settings,
          validityFrom,
          validityTo,
          isObligatory,
          certificateIssuance,
        );
        return await this.assignmentRepository.save(assignment);
    }
  }

  async createMany(assignmentDto: EnrollManyDto, userId: string) {
     const { groupAssignment, userAssignment } = await this.workerService.asyncCall<{ userAssignment: AssignmentEntity[], groupAssignment: AssignmentEntity[] }>(
       'enroll',
       { assignmentDto, userId }
     )
    await Promise.all([
      this.executeAssignmentsMessagesDeliveryService.execute(userAssignment),
      this.executeAssignmentsMessagesDeliveryService.executeForGroup(groupAssignment)
    ])
  }

  @OnEvent(EventActionEnum.OBLIGATORY_UPDATED, { async: true })
  async handleObligatoryUpdated({ roleDibId, addedEducationElements, isObligatory }: ObligatoryUpdatedEvent) {
    const users = await this.userRepository.findByRoleDibId(roleDibId);
    await Promise.all(
      addedEducationElements.map(el =>
        Promise.all(
          users.map(u =>
            this.assignmentRepository.findByUserIdAndEducationElementId(u.id, el.id).then(assignment => {
              if (!assignment) {
                return this.create({
                  ownerType: EducationRequestOwnerTypeEnum.USER,
                  userId: u.id,
                  educationElementId: el.id,
                  isObligatory,
                }).then(assignment => {
                  this.eventEmitter.emit(
                    EventActionEnum.CREATE_PERFORMANCE_ON_PROGRAM_SETTINGS_UPDATED,
                    new CreatePerformanceOnProgramSettingsUpdatedEvent(u.id, el.id, el.elementType, assignment.id),
                  );
                });
              }
            }),
          ),
        ),
      ),
    );
  }

  @OnEvent(EventActionEnum.DIB_USERS_IMPORT, { async: true })
  async handleDibUsersImport({ users }: DibUsersImportEvent) {
    await Promise.all(
      users.map(u =>
        this.programSettingsRepository.findByRoleDibId(u.roleDib.id).then(settings => {
          if (settings.length) {
            const obligatoryElements = uniqBy(
              flatten(settings.map(settings => settings.obligatory)),
              element => element.id,
            );
            const optionalElements = uniqBy(
              flatten(settings.map(settings => settings.optional)),
              element => element.id,
            );
            return Promise.all([
              ...obligatoryElements.map(el =>
                this.assignmentRepository.findByUserIdAndEducationElementId(u.id, el.id).then(assignment => {
                  if (!assignment) {
                    return this.create({
                      ownerType: EducationRequestOwnerTypeEnum.USER,
                      userId: u.id,
                      educationElementId: el.id,
                      isObligatory: true,
                    }).then(assignment => {
                      this.eventEmitter.emit(
                        EventActionEnum.CREATE_PERFORMANCE_ON_PROGRAM_SETTINGS_UPDATED,
                        new CreatePerformanceOnProgramSettingsUpdatedEvent(u.id, el.id, el.elementType, assignment.id),
                      );
                    });
                  }
                }),
              ),
              ...optionalElements.map(el =>
                this.assignmentRepository.findByUserIdAndEducationElementId(u.id, el.id).then(assignment => {
                  if (!assignment) {
                    return this.create({
                      ownerType: EducationRequestOwnerTypeEnum.USER,
                      userId: u.id,
                      educationElementId: el.id,
                      isObligatory: false,
                    }).then(assignment => {
                      this.eventEmitter.emit(
                        EventActionEnum.CREATE_PERFORMANCE_ON_PROGRAM_SETTINGS_UPDATED,
                        new CreatePerformanceOnProgramSettingsUpdatedEvent(u.id, el.id, el.elementType, assignment.id),
                      );
                    });
                  }
                }),
              ),
            ]);
          }
        }),
      ),
    );
  }
}

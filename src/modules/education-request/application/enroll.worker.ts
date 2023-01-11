import { createWorkerConnection } from '@src/export-workers/export.worker';
import { CreateAssignmentDto, EnrollManyDto } from '@modules/education-request/controllers/dtos/create-assignment.dto';
import { UserRepository } from '@modules/user/infrastructure/database/user.repository';
import { GroupRepository } from '@modules/group/infrastructure/database/group.repository';
import {
  EducationElementRepository, EducationProgramRepository
} from '@modules/education-program/infrastructure/database/education-program.repository';
import { EducationElementTypeEnum } from '@modules/education-program/domain/education-element.entity';
import { AssignmentEntity } from '@modules/education-request/domain/assignment.entity';
import { TestSettingsRepository } from '@modules/education-program/infrastructure/database/test-settings.repository';
import {
  CourseSettingsRepository
} from '@modules/education-program/infrastructure/database/course-settings.repository';
import {
  EducationProgramSettingsRepository
} from '@modules/education-program/infrastructure/database/education-program-settings.repository';
import { TestSettingsEntity } from '@modules/education-program/domain/test-settings.entity';
import { CourseSettingsEntity } from '@modules/education-program/domain/course-settings.entity';
import { EducationProgramSettingsEntity } from '@modules/education-program/domain/education-program-settings.entity';
import { each, flatten } from 'lodash';
import { AssignmentRepository } from '@modules/education-request/infrastructure/database/assignment.repository';
import { EventRepository } from '@modules/event/infrastructure/database/event.repository';
import { EventEntity, EventTypeEnum } from '@modules/event/domain/event.entity';
import { EducationRequestOwnerTypeEnum } from '@modules/education-request/domain/education-request.entity';
import { CreatePerformanceService } from '@modules/performance/application/create-performance.service';
import {
  CoursePerformanceRepository, EducationProgramPerformanceRepository,
  TestPerformanceRepository
} from '@modules/performance/infrastructure/database/performance.repository';
import { TestRepository } from '@modules/test/infrastructure/database/test.repository';
import { CourseRepository } from '@modules/course/infrastructure/database/course.repository';
import { CourseEntity } from '@modules/course/domain/course.entity';
import { TestEntity } from '@modules/test/domain/test.entity';
import { EducationProgramEntity } from '@modules/education-program/domain/education-program.entity';

export const enrollWorker = async ({ userId, assignmentDto: dto }: { assignmentDto: EnrollManyDto, userId: string }) => {
  const connection = await createWorkerConnection(`Connection ${Math.random()}`)
  const userRepository = connection.getCustomRepository(UserRepository)
  const groupRepository = connection.getCustomRepository(GroupRepository)
  const educationElementRepository = connection.getCustomRepository(EducationElementRepository)
  const testSettingsRepository = connection.getCustomRepository(TestSettingsRepository)
  const courseSettingsRepository = connection.getCustomRepository(CourseSettingsRepository)
  const educationProgramSettingsRepository = connection.getCustomRepository(EducationProgramSettingsRepository)
  const assignmentRepository = connection.getCustomRepository(AssignmentRepository)
  const eventRepository = connection.getCustomRepository(EventRepository)
  const coursePerformanceRepository = connection.getCustomRepository(CoursePerformanceRepository)
  const testRepository = connection.getCustomRepository(TestRepository)
  const testPerformanceRepository = connection.getCustomRepository(TestPerformanceRepository)
  const educationProgramRepository = connection.getCustomRepository(EducationProgramRepository)
  const educationProgramPerformanceRepository = connection.getCustomRepository(EducationProgramPerformanceRepository)
  const courseRepository = connection.getCustomRepository(CourseRepository)

  const createPerformanceService = new CreatePerformanceService(
    userRepository,
    educationElementRepository,
    coursePerformanceRepository,
    courseRepository,
    testRepository,
    testPerformanceRepository,
    educationProgramRepository,
    educationProgramPerformanceRepository,
    assignmentRepository
  )

  const createAssignment = async (
    {
      isObligatory,
      certificateIssuance,
      groupId,
      educationElementId,
      programSettings,
      testSettings,
      validityFrom,
      validityTo,
      userId,
      ownerType,
      courseSettings
    }: CreateAssignmentDto
  ) => {
    const [user, group, educationElement] = await Promise.all([
      userRepository.findById(userId),
      groupRepository.findById(groupId),
      educationElementRepository.findById(educationElementId),
    ]);
    let settings;
    let assignment: AssignmentEntity;
    switch (educationElement.elementType) {
      case EducationElementTypeEnum.TEST:
        settings = new TestSettingsEntity(
          testSettings?.timeLimit ?? educationElement.duration,
          testSettings.numberOfAttempts,
          testSettings.questionDeliveryFormat,
          testSettings.questionSelectionType,
          testSettings.questionMixingType,
          testSettings.answerMixingType,
          testSettings.isCorrectAnswersAvailable,
          testSettings.maxScore,
          testSettings.passingScore,
          isObligatory,
          undefined,
          validityFrom,
          validityTo,
        );
        await testSettingsRepository.save(settings)
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
        break
      case EducationElementTypeEnum.COURSE:
        settings = new CourseSettingsEntity(courseSettings?.timeLimit ?? educationElement.duration, courseSettings.numberOfAttempts, isObligatory, validityFrom, validityTo);
        await courseSettingsRepository.save(settings)
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
        break
      case EducationElementTypeEnum.PROGRAM:
        settings = new EducationProgramSettingsEntity(programSettings.orderOfStudy, validityFrom, validityTo);
        await educationProgramSettingsRepository.save(settings)
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
    }
    return assignment;
  }

  const assignments = flatten(
    await Promise.all(
      dto.owners.map(owner => {
        return Promise.all(
          dto.educationElementIds.map(educationElementDto => {
            return createAssignment({
              ownerType: owner.ownerType,
              userId: owner.id,
              groupId: owner.id,
              educationElementId: educationElementDto.educationElementId,
              validityFrom: dto.validityFrom,
              validityTo: dto.validityTo,
              courseSettings: dto.courseSettings,
              programSettings: dto.programSettings,
              testSettings: dto.testSettings,
              certificateIssuance: dto.certificateIssuance,
            })
          })
        )
      })
    )
  )

  await assignmentRepository.save(assignments)

  const userAssignment: AssignmentEntity[] = []
  const userTestAssignment: AssignmentEntity[] = []
  const userCourseAssignment: AssignmentEntity[] = []
  const userProgramAssignment: AssignmentEntity[] = []
  const groupAssignment: AssignmentEntity[] = []
  const groupTestAssignment: AssignmentEntity[] = []
  const groupCourseAssignment: AssignmentEntity[] = []
  const groupProgramAssignment: AssignmentEntity[] = []
  const events: EventEntity[] = []

  each(assignments, assignment => {
    if (assignment.ownerType === EducationRequestOwnerTypeEnum.GROUP) {
      events.push(new EventEntity(
        EventTypeEnum.INFO,
        'Зачисления',
        `Пользователь id=${userId} зачислил группу id=${assignment.groupId} на элемент обучения id=${assignment.educationElementId}`
      ))
      groupAssignment.push(assignment)
      switch (assignment.educationElement.elementType) {
        case EducationElementTypeEnum.TEST:
          groupTestAssignment.push(assignment)
          break
        case EducationElementTypeEnum.COURSE:
          groupCourseAssignment.push(assignment)
          break
        case EducationElementTypeEnum.PROGRAM:
          groupProgramAssignment.push(assignment)
          break
      }
    } else {
      events.push(new EventEntity(
        EventTypeEnum.INFO,
        'Зачисления',
        `Пользователь id=${userId} зачислил пользователя id=${assignment.userId} на элемент обучения id=${assignment.educationElementId}`
      ))
      userAssignment.push(assignment)
      switch (assignment.educationElement.elementType) {
        case EducationElementTypeEnum.TEST:
          userTestAssignment.push(assignment)
          break
        case EducationElementTypeEnum.COURSE:
          userCourseAssignment.push(assignment)
          break
        case EducationElementTypeEnum.PROGRAM:
          userProgramAssignment.push(assignment)
          break
      }
    }
  })

  await eventRepository.save(events)

  await Promise.all([
    createPerformanceService.manuallyCreateCoursePerformance(
      userCourseAssignment.map(assignment => ({ user: assignment.user, course: assignment.educationElement as CourseEntity, assignment, courseSettings: assignment.courseSettings }))
    ),
    createPerformanceService.manuallyCreateTestPerformance(
      userTestAssignment.map(assignment => ({ user: assignment.user, test: assignment.educationElement as TestEntity, assignment, testSettings: assignment.testSettings }))
    ),
    createPerformanceService.manuallyCreateEducationProgramPerformance(
      userProgramAssignment.map(assignment => ({ user: assignment.user, assignment, program: assignment.educationElement as EducationProgramEntity }))
    ),
  ])

  await Promise.all([
    ...groupTestAssignment.map(assignment => {
      const users = assignment.group.users.map(userInGroup => userInGroup.user)
      return createPerformanceService.manuallyCreateTestPerformance(
        users.map(user => ({ user, test: assignment.educationElement as TestEntity, assignment, testSettings: assignment.testSettings }))
      )
    }),
    ...groupCourseAssignment.map(assignment => {
      const users = assignment.group.users.map(userInGroup => userInGroup.user)
      return createPerformanceService.manuallyCreateCoursePerformance(
        users.map(user => ({ user, course: assignment.educationElement as CourseEntity, assignment, courseSettings: assignment.courseSettings }))
      )
    }),
    ...groupProgramAssignment.map(assignment => {
      const users = assignment.group.users.map(userInGroup => userInGroup.user)
      return createPerformanceService.manuallyCreateEducationProgramPerformance(
        users.map(user => ({ user, program: assignment.educationElement as EducationProgramEntity, assignment }))
      )
    })
  ])

  await connection.close()

  return { userAssignment, groupAssignment }
}
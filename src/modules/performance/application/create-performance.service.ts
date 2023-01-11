import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CoursePerformanceEntity,
  EducationProgramPerformanceEntity,
  PerformanceEntity,
  TestPerformanceEntity,
} from '@modules/performance/domain/performance.entity';
import {
  CoursePerformanceRepository,
  EducationProgramPerformanceRepository,
  TestPerformanceRepository,
} from '@modules/performance/infrastructure/database/performance.repository';
import { CreatePerformanceDto } from '@modules/performance/controllers/dtos/create-performance.dto';
import { UserRepository } from '@modules/user/infrastructure/database/user.repository';
import { UserException } from '@modules/user/infrastructure/exceptions/user.exception';
import { TestRepository } from '@modules/test/infrastructure/database/test.repository';
import { TestException } from '@modules/test/infrastructure/exceptions/test.exception';
import { CourseRepository } from '@modules/course/infrastructure/database/course.repository';
import { CourseException } from '@modules/course/infrastructure/exceptions/course.exception';
import {
  EducationElementRepository,
  EducationProgramRepository,
} from '@modules/education-program/infrastructure/database/education-program.repository';
import {
  EducationProgramException
} from '@modules/education-program/infrastructure/exceptions/education-program.exception';
import { AssignmentRepository } from '@modules/education-request/infrastructure/database/assignment.repository';
import {
  CourseProgramElementEntity,
  ProgramElementEntity,
  ProgramElementTypeEnum,
  TestProgramElementEntity,
} from '@modules/education-program/domain/program-element.entity';
import { TestSettingsEntity } from '@modules/education-program/domain/test-settings.entity';
import { CourseSettingsEntity } from '@modules/education-program/domain/course-settings.entity';
import { UserEntity } from '@modules/user/domain/user.entity';
import { TestEntity } from '@modules/test/domain/test.entity';
import { AssignmentEntity } from '@modules/education-request/domain/assignment.entity';
import { CourseEntity } from '@modules/course/domain/course.entity';
import { EducationProgramEntity } from '@modules/education-program/domain/education-program.entity';

type ManuallyCreateTestPerformanceDto = {
  user: UserEntity
  test: TestEntity
  testSettings: TestSettingsEntity
  assignment: AssignmentEntity
  parentPerformance?: PerformanceEntity
  programElement?: ProgramElementEntity
}

type ManuallyCreateCoursePerformanceDto = {
  user: UserEntity
  course: CourseEntity
  courseSettings: CourseSettingsEntity
  assignment: AssignmentEntity
  parentPerformance?: PerformanceEntity
  programElement?: ProgramElementEntity
}

type ManuallyCreateEducationProgramPerformanceDto = {
  program: EducationProgramEntity
  user: UserEntity
  assignment: AssignmentEntity
}

@Injectable()
export class CreatePerformanceService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    @InjectRepository(EducationElementRepository)
    private educationElementRepository: EducationElementRepository,
    @InjectRepository(CoursePerformanceRepository)
    private coursePerformanceRepository: CoursePerformanceRepository,
    @InjectRepository(CourseRepository)
    private courseRepository: CourseRepository,
    @InjectRepository(TestRepository)
    private testRepository: TestRepository,
    @InjectRepository(TestPerformanceRepository)
    private testPerformanceRepository: TestPerformanceRepository,
    @InjectRepository(EducationProgramRepository)
    private educationProgramRepository: EducationProgramRepository,
    @InjectRepository(EducationProgramPerformanceRepository)
    private educationProgramPerformanceRepository: EducationProgramPerformanceRepository,
    @InjectRepository(AssignmentRepository)
    private assignmentRepository: AssignmentRepository,
  ) {}

  async createCoursePerformance(
    {
      courseId,
      attemptsLeft,
      userId,
      assignmentId,
    }: Omit<CreatePerformanceDto, 'educationElementId' | 'testId' | 'educationProgramId'>,
    parentPerformance?: PerformanceEntity,
    courseSettings?: CourseSettingsEntity,
    programElement?: ProgramElementEntity,
  ) {
    const [user, course, assignment] = await Promise.all([
      this.userRepository.findById(userId),
      this.courseRepository.findById(courseId),
      this.assignmentRepository.findByIdWithSettings(assignmentId),
    ]);
    if (!user) UserException.NotFound('Зачисления');
    if (!course) CourseException.NotFound();
    const settings = assignment?.courseSettings || courseSettings;
    const performance = new CoursePerformanceEntity(
      user,
      course,
      5,
      settings,
      assignment,
      parentPerformance,
      programElement,
    );
    return await this.coursePerformanceRepository.save(performance);
  }

  async manuallyCreateCoursePerformance(dto: ManuallyCreateCoursePerformanceDto[]) {
    const coursePerformances = dto.map(({ course, parentPerformance, programElement, courseSettings, user, assignment }) => new CoursePerformanceEntity(
      user,
      course,
      5,
      courseSettings,
      assignment,
      parentPerformance,
      programElement
    ))
    await this.coursePerformanceRepository.save(coursePerformances)
  }

  async createTestPerformance(
    {
      testId,
      attemptsLeft,
      userId,
      assignmentId,
    }: Omit<CreatePerformanceDto, 'educationElementId' | 'courseId' | 'educationProgramId'>,
    parentPerformance?: PerformanceEntity,
    testSettings?: TestSettingsEntity,
    programElement?: ProgramElementEntity,
  ) {
    const [user, test, assignment] = await Promise.all([
      this.userRepository.findById(userId),
      this.testRepository.findById(testId),
      this.assignmentRepository.findByIdWithSettings(assignmentId),
    ]);
    if (!user) UserException.NotFound('Зачисления');
    if (!test) TestException.NotFound();
    const settings = assignment?.testSettings || testSettings;
    const performance = new TestPerformanceEntity(
      user,
      test,
      5,
      settings,
      assignment,
      parentPerformance,
      programElement,
    );
    return await this.testPerformanceRepository.save(performance);
  }

  async manuallyCreateTestPerformance(dto: ManuallyCreateTestPerformanceDto[]) {
    const testPerformances = dto.map(({ test, parentPerformance, programElement, testSettings, user, assignment }) => new TestPerformanceEntity(
      user,
      test,
      5,
      testSettings,
      assignment,
      parentPerformance,
      programElement
    ))
    await this.testPerformanceRepository.save(testPerformances)
  }

  async createEducationProgramPerformance({
    educationProgramId,
    userId,
    assignmentId,
  }: Omit<CreatePerformanceDto, 'educationElementId' | 'courseId' | 'testId'>) {
    const [user, educationProgram, assignment] = await Promise.all([
      this.userRepository.findById(userId),
      this.educationProgramRepository.findByIdWithProgramElementsAndSettings(educationProgramId),
      this.assignmentRepository.findById(assignmentId),
    ]);
    if (!user) UserException.NotFound('Зачисления');
    if (!educationProgram) EducationProgramException.NotFound();
    const performance = new EducationProgramPerformanceEntity(
      user,
      educationProgram,
      5,
      assignment.educationProgramSettings,
      assignment,
    );
    await this.educationProgramPerformanceRepository.save(performance);
    await Promise.all(
      educationProgram.programElements.map(programElement => {
        switch (programElement.elementType) {
          case ProgramElementTypeEnum.COURSE:
            const courseElement = programElement as CourseProgramElementEntity;
            return this.createCoursePerformance(
              { courseId: courseElement.course.id, attemptsLeft: 5, userId },
              performance,
              courseElement.courseSettings,
              programElement,
            );
          case ProgramElementTypeEnum.TEST:
            const testElement = programElement as TestProgramElementEntity;
            return this.createTestPerformance(
              { testId: testElement.test.id, attemptsLeft: 5, userId },
              performance,
              testElement.testSettings,
              programElement,
            );
        }
      }),
    );
    return performance;
  }

  async manuallyCreateEducationProgramPerformance(dto: ManuallyCreateEducationProgramPerformanceDto[]) {
    const programPerformancesForSave = []
    const dtoForCreateTestPerformance: ManuallyCreateTestPerformanceDto[] = []
    const dtoForCreateCoursePerformance: ManuallyCreateCoursePerformanceDto[] = []
    await Promise.all(dto.map(({ program, assignment, user}) => {
      return this.educationProgramRepository.findByIdWithProgramElementsAndSettings(program.id)
        .then(fullProgram => {
          const programPerformance = new EducationProgramPerformanceEntity(
            user,
            fullProgram,
            5,
            assignment.educationProgramSettings,
            assignment
          )
          programPerformancesForSave.push(programPerformance)
          fullProgram.programElements.forEach(programElement => {
            if (programElement.elementType === ProgramElementTypeEnum.TEST) {
              const testElement = programElement as TestProgramElementEntity
              dtoForCreateTestPerformance.push({
                test: testElement.test,
                user,
                assignment,
                testSettings: testElement.testSettings,
                programElement,
                parentPerformance: programPerformance
              })
            } else {
              const courseElement = programElement as CourseProgramElementEntity
              dtoForCreateCoursePerformance.push({
                course: courseElement.course,
                assignment,
                user,
                programElement,
                parentPerformance: programPerformance,
                courseSettings: courseElement.courseSettings
              })
            }
          })
        })
    }))
    await this.educationProgramPerformanceRepository.save(programPerformancesForSave)
    await Promise.all([
      this.manuallyCreateCoursePerformance(dtoForCreateCoursePerformance),
      this.manuallyCreateTestPerformance(dtoForCreateTestPerformance)
    ])
  }
}

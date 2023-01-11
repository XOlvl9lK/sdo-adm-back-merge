import { ChildEntity, Column, Entity, JoinColumn, ManyToOne, OneToOne, TableInheritance } from 'typeorm';
import { BaseEntity } from '@core/domain/base.entity';
import { UserEntity } from '@modules/user/domain/user.entity';
import { TestEntity } from '@modules/test/domain/test.entity';
import { CourseEntity } from '@modules/course/domain/course.entity';
import { PerformanceException } from '@modules/performance/infrastructure/exceptions/performance.exception';
import { CourseAttemptEntity, TestAttemptEntity } from '@modules/performance/domain/attempt.entity';
import {
  EducationElementEntity,
  EducationElementTypeEnum,
} from '@modules/education-program/domain/education-element.entity';
import { EducationProgramEntity } from '@modules/education-program/domain/education-program.entity';
import { ProgramElementEntity } from '@modules/education-program/domain/program-element.entity';
import { TestSettingsEntity } from '@modules/education-program/domain/test-settings.entity';
import { CourseSettingsEntity } from '@modules/education-program/domain/course-settings.entity';
import { EducationProgramSettingsEntity } from '@modules/education-program/domain/education-program-settings.entity';
import { AssignmentEntity } from '@modules/education-request/domain/assignment.entity';

export enum PerformanceStatusEnum {
  DID_NOT_OPEN = 'Не начат',
  NOT_FINISHED = 'Не завершен',
  IN_PROGRESS = 'В процессе',
  COMPLETED = 'Завершен',
  FAILED = 'Не сдан',
  PASSED = 'Сдан',
}

@Entity('performance')
@TableInheritance({ column: { type: 'text', name: 'type' } })
export class PerformanceEntity extends BaseEntity {
  @ManyToOne(() => UserEntity)
  @JoinColumn()
  user?: UserEntity;

  @Column({ nullable: true, comment: 'ID пользователя' })
  userId?: string;

  @Column({ type: 'int', default: 0, comment: 'Кол-во баллов' })
  result: number;

  @Column({
    type: 'text',
    default: PerformanceStatusEnum.DID_NOT_OPEN,
    comment: 'Статус',
  })
  status: PerformanceStatusEnum;

  @Column({
    type: 'int',
    nullable: false,
    comment: 'Оставшееся кол-во попыток',
  })
  attemptsLeft: number;

  @Column({ type: 'int', default: 0, comment: 'Кол-во потраченных попыток' })
  attemptsSpent: number;

  @Column({
    type: 'text',
    nullable: true,
    comment: 'Тип элемента образовательной программы',
  })
  elementType: EducationElementTypeEnum;

  @ManyToOne(() => EducationElementEntity, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  educationElement: EducationElementEntity;

  @Column({ nullable: true, comment: 'ID элемента обучения' })
  educationElementId: string;

  @Column({
    type: 'timestamp',
    nullable: true,
    comment: 'Дата последнего открытия',
  })
  lastOpened: Date;

  @ManyToOne(() => ProgramElementEntity)
  @JoinColumn({ name: 'program_element_id' })
  programElement: ProgramElementEntity;

  @Column({ nullable: true, comment: 'ID программы обучения' })
  program_element_id: string;

  @ManyToOne(() => PerformanceEntity, {
    onDelete: 'SET NULL'
  })
  @JoinColumn({ name: 'performance_id' })
  performance: PerformanceEntity;

  @Column({ nullable: true, comment: 'ID успеваемости программы' })
  performance_id: string;

  @Column({
    type: 'timestamp',
    nullable: true,
    name: 'start_date',
    comment: 'Дата начала',
  })
  startDate: Date;

  @Column({
    type: 'timestamp',
    nullable: true,
    name: 'complete_date',
    comment: 'Дата завершения',
  })
  completeDate: Date;

  @ManyToOne(() => TestSettingsEntity)
  @JoinColumn()
  testSettings?: TestSettingsEntity;

  @Column({ nullable: true, comment: 'ID настроек теста' })
  testSettingsId: string;

  @ManyToOne(() => CourseSettingsEntity)
  @JoinColumn()
  courseSettings?: CourseSettingsEntity;

  @Column({ nullable: true, comment: 'ID настроек курса' })
  courseSettingsId: string;

  @ManyToOne(() => EducationProgramSettingsEntity)
  @JoinColumn()
  programSettings?: EducationProgramSettingsEntity;

  @Column({ nullable: true, comment: 'ID настроек программы обучения' })
  programSettingsId: string;

  @ManyToOne(() => AssignmentEntity)
  @JoinColumn()
  assignment: AssignmentEntity;

  @Column({ nullable: true, comment: 'ID зачисления' })
  assignmentId: string;

  constructor(
    user: UserEntity,
    result: number,
    attemptsLeft: number,
    elementType: EducationElementTypeEnum,
    educationElement: EducationElementEntity,
    assignment: AssignmentEntity,
    performance?: PerformanceEntity,
  ) {
    super();
    this.user = user;
    this.result = result;
    this.status = PerformanceStatusEnum.DID_NOT_OPEN;
    this.attemptsLeft = attemptsLeft;
    this.elementType = elementType;
    this.performance = performance;
    this.educationElement = educationElement;
    this.assignment = assignment;
  }

  changeStatus(status: PerformanceStatusEnum) {
    this.status = status;
  }

  get canRun() {
    let isValidDate = true;
    if (this.assignment?.startDate && this.assignment.startDate > new Date()) {
      isValidDate = false;
    }
    if (this.assignment?.endDate && this.assignment.endDate < new Date()) {
      isValidDate = false;
    }
    if (this.testSettings) {
      const hasAttempts =
        this.testSettings.numberOfAttempts === 0 || this.testSettings.numberOfAttempts > this.attemptsSpent;
      return hasAttempts && isValidDate;
    }
    if (this.courseSettings) {
      const hasAttempts =
        this.courseSettings.numberOfAttempts === 0 || this.courseSettings.numberOfAttempts > this.attemptsSpent;
      return hasAttempts && isValidDate;
    }
    return isValidDate;
  }
}

@ChildEntity()
export class TestPerformanceEntity extends PerformanceEntity {
  @ManyToOne(() => TestEntity, {
    cascade: true,
  })
  test: TestEntity;

  @Column({ nullable: true, comment: 'ID теста' })
  testId: string;

  @OneToOne(() => TestAttemptEntity, {
    cascade: true,
    onDelete: 'SET NULL'
  })
  @JoinColumn()
  lastAttempt: TestAttemptEntity;

  @Column({ nullable: true, comment: 'ID последней попытки' })
  lastAttemptId: string;

  constructor(
    user: UserEntity,
    test: TestEntity,
    attemptsLeft: number,
    testSettings: TestSettingsEntity,
    assignment: AssignmentEntity,
    performance?: PerformanceEntity,
    programElement?: ProgramElementEntity,
  ) {
    super(user, 0, attemptsLeft, EducationElementTypeEnum.TEST, test, assignment, performance);
    this.test = test;
    this.testSettings = testSettings;
    this.programElement = programElement;
  }

  makeAttempt(result: number) {
    this.attemptsSpent++;
    if (this.result < result) this.result = result;
    if (this.result >= this.testSettings.passingScore) {
      this.status = PerformanceStatusEnum.PASSED;
      this.completeDate = new Date();
    } else {
      this.status = PerformanceStatusEnum.FAILED;
    }
    this.lastAttempt = null;
  }

  runTest() {
    if (this.status !== PerformanceStatusEnum.PASSED) this.status = PerformanceStatusEnum.IN_PROGRESS;
    this.lastOpened = new Date();
    if (!this.startDate) this.startDate = new Date();
  }
}

@ChildEntity()
export class CoursePerformanceEntity extends PerformanceEntity {
  @ManyToOne(() => CourseEntity)
  course: CourseEntity;

  @Column({ nullable: true, comment: 'ID курса' })
  courseId: string;

  @OneToOne(() => CourseAttemptEntity)
  @JoinColumn()
  lastAttempt: CourseAttemptEntity;

  @Column({ nullable: true, comment: 'ID последней попытки' })
  lastAttemptId: string;

  constructor(
    user: UserEntity,
    course: CourseEntity,
    attemptsLeft: number,
    courseSettings: CourseSettingsEntity,
    assignment: AssignmentEntity,
    performance?: PerformanceEntity,
    programElement?: ProgramElementEntity,
  ) {
    super(user, 0, attemptsLeft, EducationElementTypeEnum.COURSE, course, assignment, performance);
    this.course = course;
    this.courseSettings = courseSettings;
    this.programElement = programElement;
  }

  runCourse() {
    if (!this?.startDate) {
      this.startDate = new Date();
      this.changeStatus(PerformanceStatusEnum.IN_PROGRESS);
      this.result = 50;
    }
    this.lastOpened = new Date();
  }

  makeAttempt() {
    this.attemptsSpent++;
  }

  endCourse(scheduler?: boolean) {
    this.makeAttempt();
    if (!scheduler) {
      this.status = PerformanceStatusEnum.COMPLETED;
      this.result = 100;
      this.completeDate = new Date();
    }
  }

  failCourse() {
    this.makeAttempt()
    if (this.status !== PerformanceStatusEnum.COMPLETED) this.status = PerformanceStatusEnum.NOT_FINISHED
  }
}

@ChildEntity()
export class EducationProgramPerformanceEntity extends PerformanceEntity {
  @ManyToOne(() => EducationProgramEntity)
  @JoinColumn()
  educationProgram: EducationProgramEntity;

  @Column({ nullable: true, comment: 'ID программы обучения' })
  educationProgramId: string;

  constructor(
    user: UserEntity,
    educationProgram: EducationProgramEntity,
    attemptsLeft: number,
    programSettings: EducationProgramSettingsEntity,
    assignment: AssignmentEntity,
  ) {
    super(user, 0, attemptsLeft, EducationElementTypeEnum.PROGRAM, educationProgram, assignment);
    this.educationProgram = educationProgram;
    this.programSettings = programSettings;
  }
}

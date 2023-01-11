import { ChildEntity, Column, Entity, JoinColumn, ManyToOne, OneToOne, TableInheritance } from 'typeorm';
import { BaseEntity } from '@core/domain/base.entity';
import { TestEntity } from '@modules/test/domain/test.entity';
import { TestSettingsEntity } from '@modules/education-program/domain/test-settings.entity';
import { CourseEntity } from '@modules/course/domain/course.entity';
import { EducationProgramEntity } from 'src/modules/education-program/domain/education-program.entity';
import { CourseSettingsEntity } from '@modules/education-program/domain/course-settings.entity';
import { IOrderable } from '@core/domain/orderable.interface';

export enum ProgramElementTypeEnum {
  TEST = 'TEST',
  COURSE = 'COURSE',
}

@Entity('program_element')
@TableInheritance({ column: { type: 'text', name: 'type', comment: 'Тип элемента программы' } })
export class ProgramElementEntity extends BaseEntity implements IOrderable {
  @ManyToOne(() => EducationProgramEntity, program => program.programElements)
  educationProgram: EducationProgramEntity;

  @Column({ type: 'text', nullable: false, comment: 'Вид элемента программы' })
  elementType: ProgramElementTypeEnum;

  @Column({ type: 'int', nullable: false, comment: 'Порядковый номер' })
  order: number;

  constructor(elementType: ProgramElementTypeEnum, order: number) {
    super();
    this.elementType = elementType;
    this.order = order;
  }
}

@ChildEntity()
export class TestProgramElementEntity extends ProgramElementEntity {
  @ManyToOne(() => TestEntity, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  test: TestEntity;

  @OneToOne(() => TestSettingsEntity)
  @JoinColumn({ name: 'testSettingsId' })
  testSettings: TestSettingsEntity;

  @Column({ comment: 'ID настроек теста' })
  testSettingsId?: string;

  constructor(test: TestEntity, testSettings: TestSettingsEntity, order: number) {
    super(ProgramElementTypeEnum.TEST, order);
    this.test = test;
    this.testSettings = testSettings;
  }
}

@ChildEntity()
export class CourseProgramElementEntity extends ProgramElementEntity {
  @ManyToOne(() => CourseEntity, {
    cascade: true,
  })
  @JoinColumn()
  course: CourseEntity;

  @OneToOne(() => CourseSettingsEntity)
  @JoinColumn({ name: 'courseSettingsId' })
  courseSettings: CourseSettingsEntity;

  @Column({ comment: 'ID настроек курса' })
  courseSettingsId?: string;

  constructor(course: CourseEntity, courseSettings: CourseSettingsEntity, order: number) {
    super(ProgramElementTypeEnum.COURSE, order);
    this.courseSettings = courseSettings;
    this.course = course;
  }
}

import { ChildEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import {
  EducationElementEntity,
  EducationElementTypeEnum,
} from '@modules/education-program/domain/education-element.entity';
import { ChapterEntity } from '@modules/chapter/domain/chapter.entity';
import { TestThemeEntity } from '@modules/test/domain/test-theme.entity';
import { BaseEntity } from '@core/domain/base.entity';
import { each, filter } from 'lodash';

@ChildEntity()
export class TestEntity extends EducationElementEntity {
  @Column({
    type: 'int',
    nullable: false,
    default: 0,
    comment: 'Порог прохождения',
  })
  threshold: number;

  @OneToMany(() => ThemeInTestEntity, themeInTest => themeInTest.test)
  themes: ThemeInTestEntity[];

  @Column({ type: 'int', default: 0, comment: 'Кол-во тем' })
  totalThemes: number;

  constructor(
    title: string,
    duration,
    chapter: ChapterEntity,
    description?: string,
    threshold?: number,
    selfAssignment?: boolean,
  ) {
    super(title, EducationElementTypeEnum.TEST, chapter, description);
    this.duration = duration || 0;
    threshold && (this.threshold = threshold);
    selfAssignment && (this.isSelfAssignmentAvailable = selfAssignment);
  }

  update(
    title: string,
    duration: number,
    selfAssignment: boolean,
    available: boolean,
    chapter: ChapterEntity,
    description?: string,
  ) {
    this.title = title.trim();
    this.duration = duration || 0;
    this.isSelfAssignmentAvailable = selfAssignment;
    this.available = available;
    this.chapter = chapter;
    this.description = description ? description.trim() : null;
  }

  hasQuestions() {
    let bool = false
    each(this.themes, (theme) => {
      const filteredQuestions = filter(theme.theme.questions, q => !q.question.isArchived)
      if (filteredQuestions.length) bool = true
    })
    return bool
  }
}

@Entity('theme_in_test')
export class ThemeInTestEntity extends BaseEntity {
  @Column({ type: 'int', nullable: false, comment: 'Порядок вывода темы' })
  order: number;

  @ManyToOne(() => TestThemeEntity, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  theme: TestThemeEntity;

  @Column({ nullable: true, comment: 'ID темы' })
  themeId: string;

  @ManyToOne(() => TestEntity, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  test: TestEntity;

  @Column({ nullable: true, comment: 'ID теста' })
  testId: string;

  constructor(order: number, testTheme: TestThemeEntity, test: TestEntity) {
    super();
    this.order = order;
    this.theme = testTheme;
    this.test = test;
  }
}

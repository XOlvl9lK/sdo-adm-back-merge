import { ChildEntity, Column, Entity, TableInheritance } from 'typeorm';
import { BaseEntity } from '@core/domain/base.entity';
import { TestQuestionTypesEnum } from '@modules/test/domain/test-question.entity';

export enum AnswerTypesEnum {
  DEFAULT = 'DEFAULT',
  ASSOCIATIVE = 'ASSOCIATIVE',
  ORDERED = 'ORDERED',
}

@Entity('answer')
@TableInheritance({ column: { type: 'text', name: 'type' } })
export abstract class AnswerEntity extends BaseEntity {
  @Column({ type: 'text', nullable: false, comment: 'Значение' })
  value: string;

  @Column({ type: 'text', nullable: false, comment: 'Тип ответа' })
  type: TestQuestionTypesEnum;

  protected constructor(value: string) {
    super();
    this.value = value?.trim();
  }

  abstract isAnswerCorrect(...args: any): boolean;
}

@ChildEntity()
export class SingleAnswerEntity extends AnswerEntity {
  @Column({ type: 'boolean', nullable: false, comment: 'Признак правильности' })
  isCorrect: boolean;

  constructor(value: string, isCorrect: boolean) {
    super(value);
    this.isCorrect = isCorrect;
    this.type = TestQuestionTypesEnum.SINGLE;
  }

  isAnswerCorrect(): boolean {
    return this.isCorrect;
  }
}

@ChildEntity()
export class MultipleAnswerEntity extends AnswerEntity {
  @Column({ type: 'boolean', nullable: false, comment: 'Признак правильности' })
  isCorrect: boolean;

  constructor(value: string, isCorrect: boolean) {
    super(value);
    this.isCorrect = isCorrect;
    this.type = TestQuestionTypesEnum.MULTIPLE;
  }

  isAnswerCorrect(): boolean {
    return this.isCorrect;
  }
}

@ChildEntity()
export class AssociativeAnswerEntity extends AnswerEntity {
  @Column({ type: 'text', nullable: false, comment: 'Определение' })
  definition: string;

  constructor(value: string, definition: string) {
    super(value);
    this.definition = definition;
    this.type = TestQuestionTypesEnum.ASSOCIATIVE;
  }

  isAnswerCorrect(definition: string): boolean {
    return this.definition === definition;
  }
}

@ChildEntity()
export class OpenAnswerEntity extends AnswerEntity {
  @Column({ type: 'int', default: 0, comment: 'Кол-во допустимых ошибок' })
  mistakesAllowed: number;

  constructor(value: string, correctAnswer: string, mistakesAllowed: number) {
    super(value);
    this.type = TestQuestionTypesEnum.OPEN;
    this.mistakesAllowed = mistakesAllowed;
  }

  isAnswerCorrect(correctAnswer: string): boolean {
    const difference = this.getDifferenceBetweenAnswers(correctAnswer);
    return difference <= this.mistakesAllowed;
  }

  private getDifferenceBetweenAnswers(answered: string): number {
    let difference = 0;
    let comparedChars = 0;
    for (let i = 0; i < this.value.length; i++) {
      if (this.value[i] !== answered[i]) difference++;
      comparedChars++;
    }
    if (answered.length > comparedChars) {
      for (let i = comparedChars; i < answered.length; i++) {
        if (this.value[i] !== answered[i]) difference++;
      }
    }
    return difference;
  }
}

@ChildEntity()
export class OrderedAnswerEntity extends AnswerEntity {
  @Column({ type: 'int', nullable: false, comment: 'Порядок' })
  order: number;

  constructor(value: string, order: number) {
    super(value);
    this.order = order;
    this.type = TestQuestionTypesEnum.ORDERED;
  }

  isAnswerCorrect(order: number): boolean {
    return this?.order === order;
  }
}

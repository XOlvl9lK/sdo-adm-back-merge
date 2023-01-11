import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  AssociativeAnswerRepository,
  SingleAnswerRepository,
  OrderedAnswerRepository,
  MultipleAnswerRepository,
  OpenAnswerRepository,
} from '@modules/test/infrastructure/database/answer.repository';
import {
  AssociativeAnswerEntity,
  SingleAnswerEntity,
  OrderedAnswerEntity,
  MultipleAnswerEntity,
  OpenAnswerEntity,
} from '@modules/test/domain/answer.entity';
import { CreateAnswerDto } from '@modules/test/controllers/dtos/create-answer.dto';
import { TestQuestionTypesEnum } from '@modules/test/domain/test-question.entity';

@Injectable()
export class CreateAnswerService {
  constructor(
    @InjectRepository(SingleAnswerRepository)
    private singleAnswerRepository: SingleAnswerRepository,
    @InjectRepository(MultipleAnswerRepository)
    private multipleAnswerRepository: MultipleAnswerRepository,
    @InjectRepository(OpenAnswerRepository)
    private openAnswerRepository: OpenAnswerRepository,
    @InjectRepository(AssociativeAnswerRepository)
    private associativeAnswerRepository: AssociativeAnswerRepository,
    @InjectRepository(OrderedAnswerRepository)
    private orderedAnswerRepository: OrderedAnswerRepository,
  ) {}

  async create({ value, type, isCorrect, definition, order, correctAnswer, mistakesAllowed }: CreateAnswerDto) {
    switch (type) {
      case TestQuestionTypesEnum.SINGLE:
        return this.createSingleAnswer(value, isCorrect);
      case TestQuestionTypesEnum.MULTIPLE:
        return this.createMultipleAnswer(value, isCorrect);
      case TestQuestionTypesEnum.OPEN:
        return this.createOpenAnswer(value, correctAnswer, mistakesAllowed);
      case TestQuestionTypesEnum.ASSOCIATIVE:
        return this.createAssociativeAnswer(value, definition);
      case TestQuestionTypesEnum.ORDERED:
        return this.createOrderedAnswer(value, order);
    }
  }

  private async createSingleAnswer(value: string, isCorrect: boolean) {
    const answer = new SingleAnswerEntity(value, isCorrect);
    return await this.singleAnswerRepository.save(answer);
  }

  private async createMultipleAnswer(value: string, isCorrect: boolean) {
    const answer = new MultipleAnswerEntity(value, isCorrect);
    return await this.multipleAnswerRepository.save(answer);
  }

  private async createOpenAnswer(value: string, correctAnswer: string, mistakesAllowed: number) {
    const answer = new OpenAnswerEntity(value, correctAnswer, mistakesAllowed);
    return await this.openAnswerRepository.save(answer);
  }

  private async createAssociativeAnswer(value: string, definition: string) {
    const answer = new AssociativeAnswerEntity(value, definition);
    return await this.associativeAnswerRepository.save(answer);
  }

  private async createOrderedAnswer(value: string, order: number) {
    const answer = new OrderedAnswerEntity(value, order);
    return await this.orderedAnswerRepository.save(answer);
  }
}

import { Injectable } from '@nestjs/common';
import { TestQuestionEntity } from '@modules/test/domain/test-question.entity';
import { CreateAnswerService } from '@modules/test/application/create-answer.service';
import { CreateQuestionDto } from '@modules/test/controllers/dtos/create-question.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {
  QuestionInThemeRepository,
  TestQuestionRepository,
} from '@modules/test/infrastructure/database/test-question.repository';
import { TestThemeRepository } from '@modules/test/infrastructure/database/test-theme.repository';
import { TestThemeException } from '@modules/test/infrastructure/exceptions/test-theme.exception';
import { UserRepository } from '@modules/user/infrastructure/database/user.repository';
import { UserException } from '@modules/user/infrastructure/exceptions/user.exception';
import { QuestionInThemeEntity } from '@modules/test/domain/test-theme.entity';
import { CreateChildQuestionDto } from '@modules/test/controllers/dtos/create-child-question.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventActionEnum } from '@modules/event/application/create-event.service';
import { CreateEntityEvent } from '@modules/event/infrastructure/events/create-entity.event';
import { BaseException } from '@core/exceptions/base.exception';
import { orderBy } from 'lodash';

@Injectable()
export class CreateQuestionService {
  constructor(
    private createAnswerService: CreateAnswerService,
    @InjectRepository(TestQuestionRepository)
    private testQuestionRepository: TestQuestionRepository,
    @InjectRepository(TestThemeRepository)
    private testThemeRepository: TestThemeRepository,
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    @InjectRepository(QuestionInThemeRepository)
    private questionInThemeRepository: QuestionInThemeRepository,
    private eventEmitter: EventEmitter2,
  ) {}

  async create({ title, type, answers, testThemeId, authorId }: CreateQuestionDto, userId: string) {
    const [testTheme, author, ...createdAnswers] = await Promise.all([
      this.testThemeRepository.findByIdWithQuestions(testThemeId),
      this.userRepository.findById(authorId),
      ...answers.map(answer => this.createAnswerService.create({ ...answer, type })),
    ]);
    if (!testTheme) TestThemeException.NotFound();
    if (!author) UserException.NotFound('Банк вопросов');
    const question = new TestQuestionEntity(title, type, orderBy(createdAnswers, 'order'), author, testTheme);
    this.eventEmitter.emit(
      EventActionEnum.CREATE_ENTITY,
      new CreateEntityEvent('вопрос теста', userId, question.id, 'Банк вопросов'),
    );
    return await this.testQuestionRepository.save(question);
  }

  async createChild(
    { parentQuestionId, title, type, testThemeId, authorId, answers }: CreateChildQuestionDto,
    userId: string,
  ) {
    const [testTheme, author, parentQuestion, ...createdAnswers] = await Promise.all([
      this.testThemeRepository.findByIdWithQuestions(testThemeId),
      this.userRepository.findById(authorId),
      this.testQuestionRepository.findById(parentQuestionId),
      ...answers.map(answer => this.createAnswerService.create({ ...answer, type })),
    ]);
    if (!testTheme) TestThemeException.NotFound();
    if (!author) UserException.NotFound('Банк вопросов');
    const question = new TestQuestionEntity(title, type, createdAnswers, author, testTheme, parentQuestion);
    this.eventEmitter.emit(
      EventActionEnum.CREATE_ENTITY,
      new CreateEntityEvent('вопрос теста', userId, question.id, 'Банк вопросов'),
    );
    return await this.testQuestionRepository.save(question);
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  TestThemeRepository,
  ThemeInTestRepository,
} from '@modules/test/infrastructure/database/test-theme.repository';
import { ChangeOrderThemeInTestDto, UpdateTestThemeDto } from '@modules/test/controllers/dtos/update-test-theme.dto';
import { TestThemeException } from '@modules/test/infrastructure/exceptions/test-theme.exception';
import {
  QuestionInThemeRepository,
  TestQuestionRepository,
} from '@modules/test/infrastructure/database/test-question.repository';
import { AddQuestionsToThemeDto, MoveQuestionsDto } from '@modules/test/controllers/dtos/add-questions-to-theme.dto';
import { TestRepository } from '@modules/test/infrastructure/database/test.repository';
import { TestException } from '@modules/test/infrastructure/exceptions/test.exception';
import { QuestionInThemeEntity } from '@modules/test/domain/test-theme.entity';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { EventActionEnum } from '@modules/event/application/create-event.service';
import { UpdateEntityEvent } from '@modules/event/infrastructure/events/update-entity.event';
import { ChangeOrderEvent } from '@modules/event/infrastructure/events/change-order.event';
import { ChangeOrderHelper } from '@core/libs/change-order.helper';

@Injectable()
export class UpdateTestThemeService {
  constructor(
    @InjectRepository(TestThemeRepository)
    private testThemeRepository: TestThemeRepository,
    @InjectRepository(TestQuestionRepository)
    private testQuestionRepository: TestQuestionRepository,
    @InjectRepository(TestRepository)
    private testRepository: TestRepository,
    @InjectRepository(ThemeInTestRepository)
    private themeInTestRepository: ThemeInTestRepository,
    @InjectRepository(QuestionInThemeRepository)
    private questionInThemeRepository: QuestionInThemeRepository,
    private eventEmitter: EventEmitter2,
  ) {}

  async update({ id, questionsToDisplay, title, description }: UpdateTestThemeDto, userId: string) {
    const testTheme = await this.testThemeRepository.findById(id);
    if (!testTheme) TestThemeException.NotFound();
    testTheme.update(title, description, questionsToDisplay);
    this.eventEmitter.emit(
      EventActionEnum.UPDATE_ENTITY,
      new UpdateEntityEvent('тему теста', userId, 'Банк вопросов', testTheme),
    );
    return await this.testThemeRepository.save(testTheme);
  }

  async addToTheme({ themeIdTo, questionIds }: AddQuestionsToThemeDto) {
    const [testThemeTo, testQuestions] = await Promise.all([
      this.themeInTestRepository.findByIdWithQuestions(themeIdTo),
      this.testQuestionRepository.findByIds(questionIds),
    ]);
    if (!testThemeTo) TestThemeException.NotFound();
    if (!testQuestions.length || testQuestions.length !== questionIds.length) TestThemeException.NotFound();
    const questionInTheme = testQuestions.map(
      (question, idx) => new QuestionInThemeEntity(testThemeTo.theme.questions.length + 1 + idx, testThemeTo.theme, question),
    );
    return await this.questionInThemeRepository.save(questionInTheme);
  }

  async moveToTheme({ themeIdTo, questionInThemeIds }: MoveQuestionsDto) {
    const [testThemeTo, testQuestions] = await Promise.all([
      this.testThemeRepository.findByIdWithQuestions(themeIdTo),
      this.testQuestionRepository.findByIds(questionInThemeIds),
    ]);
    const themeFrom = testQuestions[0].theme;
    if (!testThemeTo) TestThemeException.NotFound();
    if (!testQuestions.length || testQuestions.length !== questionInThemeIds.length) TestThemeException.NotFound();
    testQuestions.forEach(question => {
      question.theme = testThemeTo;
    });
    return await this.testQuestionRepository.save(testQuestions);
  }

  async changeOrder({ themeId, sortActionType, testId, view }: ChangeOrderThemeInTestDto, userId: string) {
    const test = await this.testRepository.findByIdWithThemes(testId);
    if (!test) TestException.NotFound();
    ChangeOrderHelper.changeOrder(test.themes, themeId, sortActionType, view, theme => theme.theme.isArchived);
    this.eventEmitter.emit(EventActionEnum.CHANGE_ORDER, new ChangeOrderEvent(userId, test.id, 'тему теста', 'Тесты'));
    return await this.themeInTestRepository.save(test.themes);
  }
}

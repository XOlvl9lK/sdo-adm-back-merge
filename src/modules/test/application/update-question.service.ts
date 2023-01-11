import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  QuestionInThemeRepository,
  TestQuestionRepository,
} from '@modules/test/infrastructure/database/test-question.repository';
import { ChangeQuestionOrderDto } from '@modules/test/controllers/dtos/change-question-order.dto';
import { TestThemeRepository } from '@modules/test/infrastructure/database/test-theme.repository';
import { ThemeException } from '@modules/forum/infrastructure/exceptions/theme.exception';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventActionEnum } from '@modules/event/application/create-event.service';
import { ChangeOrderEvent } from '@modules/event/infrastructure/events/change-order.event';
import { ChangeComplexityDto } from '@modules/test/controllers/dtos/change-complexity.dto';
import { TestException } from '@modules/test/infrastructure/exceptions/test.exception';
import { ChangeOrderHelper } from '@core/libs/change-order.helper';

@Injectable()
export class UpdateQuestionService {
  constructor(
    @InjectRepository(TestThemeRepository)
    private testThemeRepository: TestThemeRepository,
    @InjectRepository(QuestionInThemeRepository)
    private questionInThemeRepository: QuestionInThemeRepository,
    @InjectRepository(TestQuestionRepository)
    private testQuestionRepository: TestQuestionRepository,
    private eventEmitter: EventEmitter2,
  ) {}

  async changeOrder({ themeId, sortActionType, questionId, view }: ChangeQuestionOrderDto, userId: string) {
    const theme = await this.testThemeRepository.findByIdWithQuestions(themeId);
    if (!theme) ThemeException.NotFound();
    ChangeOrderHelper.changeOrder(
      theme.questions,
      questionId,
      sortActionType,
      view,
      question => question.question.isArchived,
    );
    this.eventEmitter.emit(
      EventActionEnum.CHANGE_ORDER,
      new ChangeOrderEvent(userId, theme.id, 'темы', 'Тесты', `вопрос id=${questionId}`),
    );
    return await this.questionInThemeRepository.save(theme.questions);
  }

  async changeComplexity({ complexity, questionId }: ChangeComplexityDto) {
    const question = await this.testQuestionRepository.findById(questionId);
    if (!question) TestException.NotFound();
    question.setComplexity(complexity);
    return await this.testQuestionRepository.save(question);
  }
}

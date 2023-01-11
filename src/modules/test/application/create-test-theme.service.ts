import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  TestThemeRepository,
  ThemeInTestRepository,
} from '@modules/test/infrastructure/database/test-theme.repository';
import { CreateTestThemeDto, CreateTestThemeInTestDto } from '@modules/test/controllers/dtos/create-test-theme.dto';
import { TestThemeEntity, ThemeTypeEnum } from '@modules/test/domain/test-theme.entity';
import { TestRepository } from '@modules/test/infrastructure/database/test.repository';
import { TestException } from '@modules/test/infrastructure/exceptions/test.exception';
import { ThemeInTestEntity } from '@modules/test/domain/test.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventActionEnum } from '@modules/event/application/create-event.service';
import { CreateEntityEvent } from '@modules/event/infrastructure/events/create-entity.event';

@Injectable()
export class CreateTestThemeService {
  constructor(
    @InjectRepository(TestThemeRepository)
    private testThemeRepository: TestThemeRepository,
    @InjectRepository(TestRepository)
    private testRepository: TestRepository,
    @InjectRepository(ThemeInTestRepository)
    private themeInTestRepository: ThemeInTestRepository,
    private eventEmitter: EventEmitter2,
  ) {}

  async create({ title, description, questionsToDisplay }: CreateTestThemeDto, userId: string) {
    const testTheme = new TestThemeEntity(title, ThemeTypeEnum.QUESTION, questionsToDisplay, description);
    this.eventEmitter.emit(
      EventActionEnum.CREATE_ENTITY,
      new CreateEntityEvent('тему теста', userId, testTheme.id, 'Банк вопросов'),
    );
    return await this.testThemeRepository.save(testTheme);
  }

  async createInTest({ testId, questionsToDisplay, title, description }: CreateTestThemeInTestDto, userId: string) {
    const test = await this.testRepository.findByIdWithThemes(testId);
    if (!test) TestException.NotFound();
    const testTheme = new TestThemeEntity(title, ThemeTypeEnum.TEST, questionsToDisplay, description);
    const themeInTest = new ThemeInTestEntity(test.themes.length + 1, testTheme, test);
    this.eventEmitter.emit(
      EventActionEnum.CREATE_ENTITY,
      new CreateEntityEvent('тему теста', userId, testTheme.id, 'Тесты'),
    );
    this.eventEmitter.emit('test/addTheme', { testId });
    return await this.themeInTestRepository.save(themeInTest);
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  QuestionInThemeRepository,
  TestQuestionRepository,
} from '@modules/test/infrastructure/database/test-question.repository';
import { RequestQuery } from '@core/libs/types';
import {
  TestThemeRepository,
  ThemeInTestRepository
} from '@modules/test/infrastructure/database/test-theme.repository';

@Injectable()
export class FindQuestionService {
  constructor(
    @InjectRepository(TestQuestionRepository)
    private testQuestionRepository: TestQuestionRepository,
    @InjectRepository(TestThemeRepository)
    private testThemeRepository: TestThemeRepository,
    @InjectRepository(QuestionInThemeRepository)
    private questionInThemeRepository: QuestionInThemeRepository,
    @InjectRepository(ThemeInTestRepository)
    private themeInTestRepository: ThemeInTestRepository
  ) {}

  async findById(id: string) {
    return await this.testQuestionRepository.findById(id);
  }

  async findExcludingTheme(themeId: string, requestQuery: RequestQuery) {
    const themeInTest = await this.themeInTestRepository.findByIdWithQuestions(themeId);
    return await this.testQuestionRepository.findExcludingIds(
      themeInTest.theme.questions.map(question => question.question.id),
      requestQuery,
    );
  }

  async findQuestionInThemeById(id: string) {
    const question = await this.testQuestionRepository.findById(id);
    const childQuestions = await this.testQuestionRepository.findChild(question.id);
    return {
      ...question,
      childQuestions,
    };
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  TestThemeRepository,
  ThemeInTestRepository,
} from '@modules/test/infrastructure/database/test-theme.repository';
import {
  QuestionInThemeRepository,
  TestQuestionRepository,
} from '@modules/test/infrastructure/database/test-question.repository';
import { RequestQuery } from '@core/libs/types';
import { GetTestThemeByIdsDto } from '@modules/test/controllers/dtos/get-test-theme-by-ids.dto';

@Injectable()
export class FindTestThemeService {
  constructor(
    @InjectRepository(TestThemeRepository)
    private testThemeRepository: TestThemeRepository,
    @InjectRepository(QuestionInThemeRepository)
    private questionInThemeRepository: QuestionInThemeRepository,
    @InjectRepository(TestQuestionRepository)
    private testQuestionRepository: TestQuestionRepository,
    @InjectRepository(ThemeInTestRepository)
    private themeInTestRepository: ThemeInTestRepository
  ) {}

  async findAll(requestQuery: RequestQuery) {
    return await this.testThemeRepository.findAll(requestQuery);
  }

  async findQuestionBank(requestQuery: RequestQuery) {
    return await this.testThemeRepository.findQuestionBank(requestQuery);
  }

  async findById(id: string, requestQuery: RequestQuery) {
    const [theme, [questions, total]] = await Promise.all([
      this.testThemeRepository.findById(id),
      this.questionInThemeRepository.findByThemeId(id, requestQuery),
    ]);
    return {
      total,
      data: {
        ...theme,
        questions,
      },
    };
  }

  async findByIds({ ids }: GetTestThemeByIdsDto) {
    return await this.testThemeRepository.findByIds(ids);
  }

  async findByIdForQuestionBank(id: string, requestQuery: RequestQuery) {
    const [theme, [questions, total]] = await Promise.all([
      this.testThemeRepository.findById(id),
      this.testQuestionRepository.findByThemeId(id, requestQuery),
    ]);
    return {
      total,
      data: {
        ...theme,
        questions,
      },
    };
  }

  async findThemeInTestById(id: string, requestQuery: RequestQuery) {
    const themeInTest = await this.themeInTestRepository.findById(id);
    const [questions, total] = await this.questionInThemeRepository.findByThemeId(themeInTest.theme.id, requestQuery)
    return {
      total,
      data: {
        ...themeInTest,
        theme: {
          ...themeInTest.theme,
          questions
        }
      },
    };
  }
}

import { EntityRepository, In } from 'typeorm';
import { TestThemeEntity, ThemeTypeEnum } from '@modules/test/domain/test-theme.entity';
import { BaseRepository } from '@core/database/base.repository';
import { ThemeInTestEntity } from '@modules/test/domain/test.entity';
import { RequestQuery } from '@core/libs/types';

@EntityRepository(TestThemeEntity)
export class TestThemeRepository extends BaseRepository<TestThemeEntity> {
  findAll({ search, view, page, pageSize, sort }: RequestQuery) {
    return this.findAndCount({
      where: {
        ...this.processSearchQuery(search),
        ...this.processViewQuery(view),
      },
      ...this.processPaginationQuery(page, pageSize),
      ...this.processSortQuery(sort),
    });
  }

  findById(id: string) {
    return this.findOne({ where: { id } });
  }

  findByIdWithQuestions(id: string) {
    return this.findOne({
      relations: ['questions', 'questions.question'],
      where: { id },
    });
  }

  findByIds(ids: string[]) {
    return this.find({
      relations: ['questions', 'questions.question', 'questions.question.answers'],
      where: {
        id: In(ids),
      },
    });
  }

  async isAlreadyExists(title: string) {
    return !!(await this.findOne({ where: { title } }));
  }

  async findQuestionBank({ search, view, page, pageSize, sort }: RequestQuery) {
    const { sortKey, sortValue } = this.processSortQueryRaw(sort);
    const viewQuery = this.processViewQueryRaw('test_theme', view);
    // Запрос с подсчётом не архивных вопросов в теме
    const sql = `
      SELECT *,
        (SELECT COUNT(*) FROM test_question where test_question."themeId" = test_theme."id" and test_question."isArchived" = false) as "totalQuestions"
      FROM test_theme WHERE test_theme."themeType" = 'QUESTION'
      AND ${viewQuery}
      ${search ? `AND test_theme."title" ILIKE '%${search}%'` : ''}
      ${sortKey && sortValue ? `ORDER BY ${sortKey} ${sortValue}` : ''}
      ${
        page && pageSize
          ? `
          OFFSET ${(Number(page) - 1) * Number(pageSize)}
          LIMIT ${Number(pageSize)}
         `
          : ''
      }
    `;

    const count = this.count({
      where: {
        ...this.processSearchQuery(search),
        ...this.processViewQuery(view),
        themeType: ThemeTypeEnum.QUESTION,
      },
      ...this.processPaginationQuery(page, pageSize),
      ...this.processSortQuery(sort),
    });

    return Promise.all([this.query(sql), count]);
  }
}

@EntityRepository(ThemeInTestEntity)
export class ThemeInTestRepository extends BaseRepository<ThemeInTestEntity> {
  findByTestId(testId: string, { view, page, pageSize, sort, search }: RequestQuery) {
    return this.findAndCount({
      relations: ['test', 'theme', 'theme.questions', 'theme.questions.question'],
      where: {
        test: { id: testId },
        theme: {
          ...this.processViewQuery(view),
          ...this.processSearchQuery(search),
        },
      },
      order: { order: 'ASC' },
      ...this.processSortQuery(sort),
      ...this.processPaginationQuery(page, pageSize),
    });
  }

  findById(id: string) {
    return this.findOne({
      relations: ['test', 'theme'],
      where: { id }
    })
  }

  findByIdWithQuestions(id: string) {
    return this.findOne({
      relations: ['test', 'theme', 'theme.questions', 'theme.questions.question'],
      where: { id }
    })
  }
}

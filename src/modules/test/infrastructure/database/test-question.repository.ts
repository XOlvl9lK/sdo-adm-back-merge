import { BaseRepository } from '@core/database/base.repository';
import { TestQuestionEntity } from '@modules/test/domain/test-question.entity';
import { EntityRepository, In, Not } from 'typeorm';
import { RequestQuery } from '@core/libs/types';
import { QuestionInThemeEntity } from '@modules/test/domain/test-theme.entity';

@EntityRepository(TestQuestionEntity)
export class TestQuestionRepository extends BaseRepository<TestQuestionEntity> {
  findById(id: string) {
    return this.findOne({
      relations: ['answers', 'author', 'parentQuestion', 'theme', 'parentQuestion.theme'],
      where: { id },
    });
  }

  findExcludingIds(ids: string[], { page, pageSize, search, sort, view }: RequestQuery) {
    const { sortKey, sortValue } = this.processSortQueryRaw(sort);
    return this.createQueryBuilder('testQuestion')
      .leftJoinAndSelect('testQuestion.theme', 'theme')
      .where('testQuestion.id NOT IN (:...ids)', {
        ids: ids?.length ? ids : ['1'],
      }) // Костыль
      .andWhere('testQuestion.isArchived = false')
      .andWhere(`testQuestion.title ILIKE '%${search || ''}%'`)
      .andWhere(this.processViewQueryRaw('testQuestion', view))
      .andWhere('theme.isArchived = false')
      .take(Number(pageSize))
      .skip((Number(page) - 1) * Number(pageSize))
      .orderBy(sortKey, sortValue)
      .getManyAndCount();
  }

  findByIds(ids: string[]) {
    return this.find({
      relations: ['answers', 'author', 'theme'],
      where: {
        id: In(ids),
      },
    });
  }

  async isAlreadyExists(title: string) {
    return !!(await this.findOne({ where: { title } }));
  }

  findChild(id: string) {
    return this.find({
      relations: ['theme'],
      where: {
        parentQuestionId: id,
      },
    });
  }

  findByThemeId(themeId: string, { page, pageSize, search, sort, view }: RequestQuery) {
    const { sortKey, sortValue } = this.processSortQueryRaw(sort);
    return this.createQueryBuilder('testQuestion')
      .leftJoinAndSelect('testQuestion.theme', 'theme')
      .where('theme.id = :themeId', { themeId })
      .andWhere(`testQuestion.title ILIKE '%${search || ''}%'`)
      .andWhere(this.processViewQueryRaw('testQuestion', view))
      .take(Number(pageSize))
      .skip((Number(page) - 1) * Number(pageSize))
      .orderBy(sortKey, sortValue)
      .getManyAndCount();
  }
}

@EntityRepository(QuestionInThemeEntity)
export class QuestionInThemeRepository extends BaseRepository<QuestionInThemeEntity> {
  findByThemeId(themeId: string, { view, page, pageSize, search }: RequestQuery) {
    return this.findAndCount({
      relations: ['theme', 'question', 'question.theme'],
      where: {
        theme: { id: themeId },
        question: {
          ...this.processViewQuery(view),
          ...this.processSearchQuery(search),
        },
      },
      order: { order: 'ASC' },
      ...this.processPaginationQuery(page, pageSize),
    });
  }

  findByIdsWithTheme(ids: string[]) {
    return this.find({
      relations: ['theme'],
      where: {
        id: In(ids),
      },
    });
  }

  findById(id: string) {
    return this.findOne({
      relations: ['theme', 'question', 'question.answers', 'question.author', 'question.parentQuestion'],
      where: { id },
    });
  }

  findByQuestionIdAndQuestionInThemeId(questionId: string, questionInThemeId: string) {
    return this.findOne({
      relations: ['theme', 'question', 'question.answers', 'question.author', 'question.parentQuestion'],
      where: {
        id: questionInThemeId,
        question: {
          id: questionId,
        },
      },
    });
  }

  findByThemeIdForQuestionBank(themeId: string, { view, page, pageSize, search, sort }: RequestQuery) {
    const { sortKey, sortValue } = this.processSortQueryRaw(sort);
    return this.createQueryBuilder('questionInTheme')
      .leftJoinAndSelect('questionInTheme.theme', 'theme')
      .leftJoinAndSelect('questionInTheme.question', 'question')
      .where('theme.id = :themeId', { themeId })
      .andWhere(search ? `question.title ILIKE '%${search}%'` : `question.title ilike '%%'`)
      .andWhere(this.processViewQueryRaw('question', view))
      .take(Number(pageSize))
      .skip((Number(page) - 1) * Number(pageSize))
      .orderBy(sortKey, sortValue)
      .getManyAndCount();
  }
}

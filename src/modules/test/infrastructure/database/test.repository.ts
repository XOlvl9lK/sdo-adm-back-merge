import { BaseRepository } from '@core/database/base.repository';
import { TestEntity } from '@modules/test/domain/test.entity';
import { EntityRepository } from 'typeorm';
import { RequestQuery } from '@core/libs/types';

@EntityRepository(TestEntity)
export class TestRepository extends BaseRepository<TestEntity> {
  findAll({ page, pageSize, sort, search, view }: RequestQuery) {
    const { sortKey, sortValue } = this.processSortQueryRaw(sort);
    return this.createQueryBuilder('test')
      .leftJoinAndSelect('test.chapter', 'chapter')
      .leftJoinAndSelect('test.themes', 'themes')
      .leftJoinAndSelect('themes.theme', 'theme')
      .leftJoinAndSelect('theme.questions', 'questions')
      .leftJoinAndSelect('questions.question', 'question')
      .where(`test.title ILIKE '%${search || ''}%'`)
      .andWhere(this.processViewQueryRaw('test', view))
      .take(Number(pageSize))
      .skip((Number(page) - 1) * Number(pageSize))
      .orderBy(sortKey, sortValue)
      .getManyAndCount();
  }

  findById(id: string) {
    return this.findOne({
      relations: ['chapter'],
      where: { id },
    });
  }

  findByIdWithThemes(id: string) {
    return this.findOne({
      relations: ['themes', 'themes.theme'],
      where: {
        id,
      },
    });
  }

  findByIdWithRelationsForRun(id: string) {
    return this.createQueryBuilder('test')
      .leftJoinAndSelect('test.themes', 'themes')
      .leftJoinAndSelect('themes.theme', 'theme')
      .leftJoinAndSelect('theme.questions', 'questions')
      .leftJoinAndSelect('questions.question', 'question')
      .leftJoinAndSelect('question.answers', 'answers')
      .where('test.id = :id', { id })
      .getOne();
  }

  async isAlreadyExists(title: string) {
    return !!(await this.findOne({ where: { title } }));
  }
}

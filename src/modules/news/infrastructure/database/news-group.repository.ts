import { EntityRepository } from 'typeorm';
import { NewsGroupEntity } from '@modules/news/domain/news-group.entity';
import { BaseRepository } from '@core/database/base.repository';
import { RequestQuery } from '@core/libs/types';

@EntityRepository(NewsGroupEntity)
export class NewsGroupRepository extends BaseRepository<NewsGroupEntity> {
  findAll({ search, view, page, sort, pageSize }: RequestQuery) {
    return this.findAndCount({
      relations: ['parentGroup'],
      where: {
        ...this.processSearchQuery(search),
        ...this.processViewQuery(view),
      },
      ...this.processSortQuery(sort),
      ...this.processPaginationQuery(page, pageSize),
    });
  }

  findById(id: string) {
    return this.findOne({
      relations: ['parentGroup'],
      where: { id },
    });
  }

  async isAlreadyExists(title: string) {
    return !!(await this.findOne({ where: { title } }));
  }
}

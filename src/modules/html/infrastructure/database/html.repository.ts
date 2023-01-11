import { EntityRepository } from 'typeorm';
import { PageContentEntity, PageEnum } from '@modules/html/domain/page-content.entity';
import { BaseRepository } from '@core/database/base.repository';
import { RequestQuery } from '@core/libs/types';

@EntityRepository(PageContentEntity)
export class HtmlRepository extends BaseRepository<PageContentEntity> {
  findByPageType(page: PageEnum) {
    return this.findOne({ where: { page } });
  }

  findAll({ sort }: RequestQuery) {
    return this.find({
      select: ['id', 'page', 'description'],
      ...this.processSortQuery(sort),
    });
  }
}

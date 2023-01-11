import { EntityRepository, ILike, In } from 'typeorm';
import { NewsEntity } from '@modules/news/domain/news.entity';
import { BaseRepository } from '@core/database/base.repository';
import { RequestQuery } from '@core/libs/types';

@EntityRepository(NewsEntity)
export class NewsRepository extends BaseRepository<NewsEntity> {
  findAll({ search, page, pageSize }: RequestQuery) {
    return this.findAndCount({
      relations: ['newsGroup'],
      where: {
        isPublished: true,
        isArchived: false,
        ...this.processSearchQuery(search),
      },
      ...this.processPaginationQuery(page, pageSize),
      order: { createdAt: 'DESC' },
    });
  }

  findLast() {
    return this.find({
      select: ['id', 'createdAt', 'title'],
      order: { createdAt: 'DESC' },
      where: {
        isPublished: true,
        isArchived: false,
      },
      take: 3,
    });
  }

  findByNewsGroupId(newsGroupId: string, { search, sort, view, page, pageSize }: RequestQuery) {
    return this.findAndCount({
      relations: ['author', 'newsGroup'],
      where: {
        news_group_id: newsGroupId,
        ...this.processSearchQuery(search),
        ...this.processViewQuery(view),
      },
      ...this.processSortQuery(sort),
      ...this.processPaginationQuery(page, pageSize),
    });
  }

  findByNewsGroupIdPublished(newsGroupId: string, { search, sort, view, page, pageSize }: RequestQuery) {
    return this.findAndCount({
      relations: ['author', 'newsGroup'],
      where: {
        news_group_id: newsGroupId,
        ...this.processSearchQuery(search),
        ...this.processViewQuery(view),
        isPublished: true,
      },
      ...this.processSortQuery(sort),
      ...this.processPaginationQuery(page, pageSize),
    });
  }

  findById(id: string) {
    return this.findOne({
      relations: ['newsGroup'],
      where: { id },
    });
  }

  findByIds(ids: string[]) {
    return this.find({
      relations: ['newsGroup'],
      where: {
        id: In(ids),
      },
    });
  }
}

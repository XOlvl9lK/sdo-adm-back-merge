import { EntityRepository, ILike } from 'typeorm';
import { ChapterEntity } from '@modules/chapter/domain/chapter.entity';
import { BaseRepository } from '@core/database/base.repository';
import { RequestQuery } from '@core/libs/types';

@EntityRepository(ChapterEntity)
export class ChapterRepository extends BaseRepository<ChapterEntity> {
  findAll({ search, sort, view, page, pageSize }: RequestQuery) {
    return this.findAndCount({
      where: {
        ...this.processViewQuery(view),
        ...(search && { title: ILike(`%${search}%`) }),
      },
      ...this.processSortQuery(sort),
      ...this.processPaginationQuery(page, pageSize),
    });
  }

  findAllWithoutPagination({ search, view, sort }: RequestQuery) {
    return this.find({
      where: {
        ...this.processViewQuery(view),
        ...(search ? { title: ILike(`%%${search}`) } : {}),
      },
      ...this.processSortQuery(sort),
    });
  }

  async isAlreadyExists(title: string) {
    return !!(await this.findOne({ where: { title } }));
  }
}

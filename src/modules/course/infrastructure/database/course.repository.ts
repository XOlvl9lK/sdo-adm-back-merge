import { BaseRepository } from '@core/database/base.repository';
import { CourseEntity } from '@modules/course/domain/course.entity';
import { EntityRepository, ILike } from 'typeorm';
import { RequestQuery } from '@core/libs/types';

@EntityRepository(CourseEntity)
export class CourseRepository extends BaseRepository<CourseEntity> {
  findAll({ search, view, sort, page, pageSize }: RequestQuery) {
    return this.findAndCount({
      relations: ['chapter'],
      where: {
        ...this.processViewQuery(view),
        ...(search ? { title: ILike(`%${search}%`) } : {}),
      },
      ...this.processSortQuery(sort),
      ...this.processPaginationQuery(page, pageSize),
    });
  }

  findById(id: string) {
    return this.findOne({
      relations: ['chapter'],
      where: { id },
    });
  }

  async isAlreadyExists(title: string) {
    return !!(await this.findOne({ where: { title } }));
  }
}

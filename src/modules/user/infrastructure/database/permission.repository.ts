import { EntityRepository } from 'typeorm';
import { PermissionEntity, PermissionEnum } from '@modules/user/domain/permission.entity';
import { BaseRepository } from '@core/database/base.repository';
import { RequestQuery } from '@core/libs/types';

@EntityRepository(PermissionEntity)
export class PermissionRepository extends BaseRepository<PermissionEntity> {
  async isAlreadyExists(code: PermissionEnum) {
    return !!(await this.findOne({ where: { code } }));
  }

  findAll({ sort, page, pageSize, search }: RequestQuery) {
    return this.findAndCount({
      where: [
        { ...this.processSearchQuery(search, 'code') },
        { ...this.processSearchQuery(search, 'description') },
      ],
      ...this.processSortQuery(sort),
      ...this.processPaginationQuery(page, pageSize),
    });
  }
}

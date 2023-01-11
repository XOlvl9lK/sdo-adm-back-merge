import { EntityRepository, ILike, In, Repository } from 'typeorm';
import { DepartmentEntity } from '@modules/authority/domain/department.entity';
import { BaseRepository } from '@core/database/base.repository';
import { RegionEntity } from '@modules/authority/domain/region.entity';
import { SubdivisionEntity } from '@modules/authority/domain/subdivision.entity';
import { RoleDibEntity } from '@modules/authority/domain/role-dib.entity';
import { RequestQuery } from '@core/libs/types';

@EntityRepository(DepartmentEntity)
export class DepartmentRepository extends BaseRepository<DepartmentEntity> {
  findById(id: string) {
    return this.findOne({
      where: {
        id: id,
      },
    });
  }

  findAll({ search, page, pageSize, sort }: RequestQuery) {
    return this.find({
      where: {
        ...this.processSearchQuery(search),
      },
      ...this.processPaginationQuery(page, pageSize),
      ...this.processSortQuery(sort),
    });
  }
}

@EntityRepository(RegionEntity)
export class RegionRepository extends BaseRepository<RegionEntity> {
  findById(id: string) {
    return this.findOne({
      where: {
        id: id,
      },
    });
  }

  findAll({ search, page, pageSize, sort }: RequestQuery) {
    return this.find({
      where: {
        ...this.processSearchQuery(search),
      },
      ...this.processPaginationQuery(page, pageSize),
      ...this.processSortQuery(sort),
    });
  }
}

@EntityRepository(SubdivisionEntity)
export class SubdivisionRepository extends BaseRepository<SubdivisionEntity> {
  findById(id: string) {
    return this.findOne({
      where: {
        id: id,
      },
    });
  }

  findAll({ search, page, pageSize, sort }: RequestQuery) {
    return this.find({
      where: {
        ...this.processSearchQuery(search),
      },
      ...this.processPaginationQuery(page, pageSize),
      ...this.processSortQuery(sort),
    });
  }
}

@EntityRepository(RoleDibEntity)
export class RoleDibRepository extends BaseRepository<RoleDibEntity> {
  findAll({ search, page, pageSize, sort }: RequestQuery) {
    return this.find({
      where: {
        ...this.processSearchQuery(search),
      },
      ...this.processPaginationQuery(page, pageSize),
      ...this.processSortQuery(sort),
    });
  }

  findById(id: string) {
    return this.findOne({
      where: {
        id: id,
      },
    });
  }

  findAvailableRolesForProgramSettings(search: string): Promise<RoleDibEntity[]> {
    return this.query(`
      SELECT * FROM role_dib WHERE 
        id NOT IN (SELECT "roleId" FROM program_settings)
        ${search ? `AND title ILIKE '%${search}%'` : ''}
      ORDER BY 
        title ASC
    `);
  }
}

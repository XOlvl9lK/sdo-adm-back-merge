import { EntityRepository } from 'typeorm';
import { RoleEntity } from '@modules/user/domain/role.entity';
import { BaseRepository } from '@core/database/base.repository';
import { RequestQuery } from '@core/libs/types';

@EntityRepository(RoleEntity)
export class RoleRepository extends BaseRepository<RoleEntity> {
  async findAll({ sort, search, pageSize, page }: RequestQuery) {
    const { sortKey, sortValue } = this.processSortQueryRaw(sort);
    const sqlQuery = `
      SELECT *,
        (SELECT COUNT(*)
          FROM "user" WHERE "user"."roleId" = "role"."id") as users
      FROM "role"
      ${search ? `WHERE "role"."title" ILIKE '%${search}%'` : ''}
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
    const count = this.createQueryBuilder('role')
      .where(`role.title ILIKE '%${search || ''}%'`)
      .getCount();

    return Promise.all([this.query(sqlQuery), count]);
  }

  findById(id: string) {
    return this.findOne({
      relations: ['parentRole', 'permissions'],
      where: {
        id,
      },
    });
  }

  async isAlreadyExists(title: string) {
    return !!(await this.findOne({ where: { title } }));
  }

  findForDelete(ids: string[]): Promise<
    {
      id: string;
      isRemovable: boolean;
      userCount: string;
      childCount: string;
    }[]
  > {
    return this.query(`
      SELECT
        id,
        is_removable as "isRemovable",
        (SELECT COUNT(*) FROM "user" WHERE "user"."roleId" = "inner_role"."id") as "userCount",
        (SELECT COUNT(*) FROM "role" WHERE "role"."parent_role_id" = "inner_role"."id") as "childCount"
      FROM "role" as "inner_role"
      WHERE "inner_role"."id" IN (${ids.map(id => `'${id}'`).join(',')})
    `);
  }
}

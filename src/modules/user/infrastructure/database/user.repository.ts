import { BaseRepository } from '@core/database/base.repository';
import { UserEntity } from 'src/modules/user/domain/user.entity';
import { Between, EntityRepository, In, Not, IsNull } from 'typeorm';
import { RequestQuery } from '@core/libs/types';
import { PerformanceStatusEnum } from '@modules/performance/domain/performance.entity';
import { EducationElementTypeEnum } from '@modules/education-program/domain/education-element.entity';
import { AuthorityEnum } from '@modules/authority/domain/authority.enum';

export const sdoId = '71f9c8c2-378f-4860-ab40-78dfdc2024ff';

@EntityRepository(UserEntity)
export class UserRepository extends BaseRepository<UserEntity> {
  findAll({ search, view, page, pageSize, sort }: RequestQuery) {
    const { sortKey, sortValue } = this.processSortQueryRaw(sort)
    return this.createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .leftJoinAndSelect('user.department', 'department')
      .leftJoinAndSelect('user.region', 'region')
      .leftJoinAndSelect('user.subdivision', 'subdivision')
      .where(`(
        user.login ILIKE '%${search || ''}%'
          OR user.firstName ILIKE '%${search || ''}%'
          OR user.middleName ILIKE '%${search || ''}%'
          OR user.lastName ILIKE '%${search || ''}%'
          OR user.fullName ILIKE '%${search || ''}%'
      )`)
      .andWhere(this.processViewQueryRaw('user', view))
      .take(pageSize && page ? Number(pageSize) : undefined)
      .skip(pageSize && page ? (Number(page) - 1) * Number(pageSize) : undefined)
      .orderBy(sortKey, sortValue)
      .getManyAndCount()
  }

  findAllSortedByLoginAndFullName({ pageSize, page, search, view }: RequestQuery) {
    const searchConditionString = search ? `
      AND ("user"."login" ILIKE '%${search}%' OR "user"."fullName" ILIKE '%${search}%')
    ` : ''
    const sqlQuery = `
      SELECT * from "user"
      WHERE ${this.processViewQueryRaw('user', view)}
      ${searchConditionString}
      ORDER BY CASE WHEN "user"."fullName" != '' THEN "user"."fullName" ELSE "user"."login" END
      ${page && pageSize ? `
          OFFSET ${(Number(page) - 1) * Number(pageSize)}
          LIMIT ${Number(pageSize)}
         ` : ''}
    `
    const count = this.createQueryBuilder('user')
      .where(this.processViewQueryRaw('user', view))
      .getCount()

    return Promise.all([this.query(sqlQuery), count])
  }

  findByLogin(login: string) {
    return this.findOne({
      relations: ['role', 'role.permissions'],
      where: { login },
    });
  }

  async isAlreadyExists(login: string) {
    return !!(await this.findByLogin(login));
  }

  findById(id: string) {
    return this.findOne({
      relations: ['role', 'department', 'region', 'subdivision', 'roleDib', 'role.permissions'],
      where: { id },
    });
  }

  findByRoleId(roleId: string, { sort, page, pageSize, search }: RequestQuery) {
    const { sortKey, sortValue } = this.processSortQueryRaw(sort)
    return this.createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .leftJoinAndSelect('user.department', 'department')
      .leftJoinAndSelect('user.region', 'region')
      .leftJoinAndSelect('user.subdivision', 'subdivision')
      .leftJoinAndSelect('user.roleDib', 'roleDib')
      .where('role.id = :roleId', { roleId })
      .andWhere(`(user.login ILIKE '%${search || ''}%' OR user.fullName ILIKE '%${search || ''}%')`)
      .take(pageSize && page ? Number(pageSize) : undefined)
      .skip(pageSize && page ? (Number(page) - 1) * Number(pageSize) : undefined)
      .orderBy(sortKey, sortValue)
      .getManyAndCount()
  }

  findExcludeRoleId(roleId: string, { sort, page, pageSize, search }: RequestQuery) {
    const { sortValue, sortKey } = this.processSortQueryRaw(sort)
    return this.createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .leftJoinAndSelect('user.department', 'department')
      .leftJoinAndSelect('user.region', 'region')
      .leftJoinAndSelect('user.subdivision', 'subdivision')
      .leftJoinAndSelect('user.roleDib', 'roleDib')
      .where('role.id != :roleId', { roleId })
      .andWhere(`(user.login ILIKE '%${search || ''}%' OR user.fullName ILIKE '%${search || ''}%')`)
      .take(pageSize && page ? Number(pageSize) : undefined)
      .skip(pageSize && page ? (Number(page) - 1) * Number(pageSize) : undefined)
      .orderBy(sortKey, sortValue)
      .getManyAndCount()
  }

  findByIds(ids: string[]) {
    return super.findByIds(ids, {
      relations: ['role', 'department', 'subdivision'],
    });
  }

  findByDateFilter(dateStart: string, dateEnd: string, { page, pageSize, sort, offset }: RequestQuery) {
    const { sortKey, sortValue } = this.processSortQueryRaw(sort);
    const skip = this.processSkipQueryRaw(page, pageSize, offset)
    const count = this.createQueryBuilder('user')
      .where(`user.createdAt BETWEEN '${this.getLowerDateLimit(dateStart)}' AND '${this.getUpperDateLimit(dateEnd)}'`)
      .getCount();
    const sqlQuery = `
      SELECT 
        "user"."id", 
        login, "user"."createdAt", "user"."isArchived",
        department."title" AS department_title, 
        subdivision."title" AS subdivision_title,
        COUNT(*) AS total, 
        (SELECT count(*)
          FROM "performance" 
          LEFT JOIN assignment ON assignment."id" = performance."assignmentId"
            WHERE "performance"."userId" = "user"."id" 
            AND "performance"."status" = '${PerformanceStatusEnum.COMPLETED}' 
            AND "performance"."elementType" = '${EducationElementTypeEnum.PROGRAM}' 
            AND assignment."isObligatory" = true) AS completed_programs 
      FROM "user" 
      LEFT JOIN department ON "department"."id" = "user"."departmentId" 
      LEFT JOIN subdivision ON "subdivision"."id" = "user"."subdivisionId" 
      WHERE "user"."createdAt" BETWEEN '${this.getLowerDateLimit(dateStart)}' AND '${this.getUpperDateLimit(dateEnd)}' 
      GROUP BY "user"."id", "department"."id", "subdivision"."id"
      ${sortKey && sortValue ? `ORDER BY ${sortKey} ${sortValue}` : ''}
      ${
        (page || offset !== 'undefined') && pageSize
          ? `
        OFFSET ${skip}
        LIMIT ${Number(pageSize)}
      `
        : ''
      }
    `;
    return Promise.all([this.query(sqlQuery), count]);
  }

  findForReportByIds(
    userIds: string[],
    dateStart: string,
    dateEnd: string,
    subdivisionId?: string,
    departmentId?: string,
  ) {
    return this.find({
      relations: ['subdivision', 'department'],
      where: {
        id: In(userIds),
        createdAt: Between(this.getLowerDateLimit(dateStart), this.getUpperDateLimit(dateEnd)),
        ...(subdivisionId ? { subdivision: { id: subdivisionId } } : {}),
        ...(departmentId ? { department: { id: departmentId } } : {}),
      },
    });
  }

  findForReport(dateStart: string, dateEnd: string, subdivisionId?: string, departmentId?: string, userIds?: string[], groupIds?: string[]) {
    const qb = this.createQueryBuilder('user')
      .leftJoinAndSelect('user.groups', 'groups')
      .leftJoinAndSelect('groups.group', 'group')
      .leftJoinAndSelect('user.subdivision', 'subdivision')
      .leftJoinAndSelect('user.department', 'department')
      .where(`user.createdAt BETWEEN '${this.getLowerDateLimit(dateStart)}' AND '${this.getUpperDateLimit(dateEnd)}'`)

    this.addWhere(
      Boolean(subdivisionId),
      qb,
      `subdivision.id = '${subdivisionId}'`
    )
    this.addWhere(
      Boolean(departmentId),
      qb,
      `department.id = '${departmentId}'`
    )

    this.addWhere(
      Boolean(groupIds?.length),
      qb,
      `group.id IN (:...groupIds)`,
      { groupIds }
    )

    return qb.getMany()
  }

  findByRoleDibId(roleDibId: string) {
    return this.find({
      relations: ['roleDib'],
      where: {
        roleDib: {
          id: roleDibId,
        },
      },
    });
  }

  findEducables({ pageSize, page, search, sort }: RequestQuery) {
    const { sortKey, sortValue } = this.processSortQueryRaw(sort)
    const subSql = `
      SELECT "user".id, 
        case WHEN "user"."fullName" != '' THEN "user"."fullName" ELSE "user"."login" END AS title, 
        "user"."institution", 'USER' as type
      FROM "user"
      ${search ? `WHERE case WHEN "user"."fullName" != '' THEN "user"."fullName" ELSE "user"."login" END ILIKE '%${search}%'` : ''}
      GROUP BY "user".id
      UNION ALL SELECT "group".id, 
        "group".title, 
        null, 
        'GROUP' AS type 
      FROM "group"
      ${search ? `WHERE title ILIKE '%${search}%'` : ''}
      GROUP BY "group".id
    `

    const educablesSql = `
      ${subSql}
      ${sortKey && sortValue ? `ORDER BY ${sortKey} ${sortValue}` : ''}
      ${page && pageSize ? `
        OFFSET ${(Number(page) - 1) * Number(pageSize)}
        LIMIT ${Number(pageSize)}
      ` : ''}
    `

    const countSql = `
      SELECT COUNT(*) FROM (${subSql}) as subSql
    `

    return Promise.all([this.query(educablesSql), this.query(countSql)])
  }

  async hasAuthorityReference(authority: AuthorityEnum) {
    const count = await this.count({
      where: {
        ...(authority === AuthorityEnum.DEPARTMENT ? { departmentId: Not(IsNull()) } : {}),
        ...(authority === AuthorityEnum.SUBDIVISION ? { subdivisionId: Not(IsNull()) } : {}),
        ...(authority === AuthorityEnum.REGION ? { departmentId: Not(IsNull()) } : {}),
      }
    })
    return !!count
  }
}

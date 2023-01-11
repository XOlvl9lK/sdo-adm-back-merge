import { EntityRepository, ILike } from 'typeorm';
import { AssignmentEntity } from '@modules/education-request/domain/assignment.entity';
import { BaseRepository } from '@core/database/base.repository';
import { RequestQuery } from '@core/libs/types';

@EntityRepository(AssignmentEntity)
export class AssignmentRepository extends BaseRepository<AssignmentEntity> {
  findAll(search?: string) {
    return this.find({
      relations: ['user', 'group', 'educationElement'],
      where: [
        { ...(search ? { group: { title: ILike(`%${search}%`) } } : {}) },
        { ...(search ? { user: { login: ILike(`%${search}%`) } } : {}) },
        { ...(search ? { user: { firstName: ILike(`%${search}%`) } } : {}) },
        { ...(search ? { user: { middleName: ILike(`%${search}%`) } } : {}) },
        { ...(search ? { user: { lastName: ILike(`%${search}%`) } } : {}) },
        { ...(search ? { user: { fullName: ILike(`%${search}%`) } } : {}) },
      ],
    });
  }

  findAllGrouped({ search, sort, page, pageSize }: RequestQuery) {
    const { sortValue, sortKey } = this.processSortQueryRaw(sort)
    const usersAndGroupsSql = `
      SELECT 
        "user".id, 
        case WHEN "user"."fullName" != '' THEN "user"."fullName" ELSE "user"."login" END AS title, 
        "user"."institution", 
        'USER' AS type,
        null as users
      FROM "user"
      UNION ALL SELECT 
        "group".id, 
        "group".title, 
        null, 
        'GROUP' AS type,
        (SELECT count(*) FROM user_in_group_entity WHERE user_in_group_entity."groupId" = "group".id) AS users
      FROM "group"
    `

    const usersAndGroupsWithCountAssignmentsSql = `
      SELECT 
        *,
        (SELECT count(*) FROM assignment WHERE assignment."userId" = subsql.id or assignment."groupId" = subsql.id) as total
      FROM (${usersAndGroupsSql}) AS subsql
    `

    const namedSql = `
      SELECT 
        id, title, institution, type, total, users
      FROM (${usersAndGroupsWithCountAssignmentsSql}) AS counted
        WHERE total > 0 ${search ? `AND title ILIKE '%${search}%'` : ''}
      ${sortKey && sortValue ? `ORDER BY ${sortKey} ${sortValue}` : ''}
    `

    const countSql = `SELECT count(*) FROM (${namedSql}) as named`

    const finalSql = `
      ${namedSql}
      ${page && pageSize ? 
        `
          OFFSET ${(Number(page) - 1) * Number(pageSize)}
          LIMIT ${Number(pageSize)}
        ` : ''}
    `

    return Promise.all([this.query(finalSql), this.query(countSql)])
  }

  findByGroupIdOrUserId(id: string, { page, pageSize, search, view, sort }: RequestQuery) {
    const { sortKey, sortValue } = this.processSortQueryRaw(sort);
    return this.createQueryBuilder('assignment')
      .leftJoinAndSelect('assignment.user', 'user')
      .leftJoinAndSelect('assignment.group', 'group')
      .leftJoinAndSelect('assignment.educationElement', 'educationElement')
      .leftJoinAndSelect('assignment.testSettings', 'testSettings')
      .where(`(user.id = :id OR group.id = :id)`, { id })
      .andWhere(`educationElement.title ILIKE '%${search || ''}%'`)
      .andWhere(this.processViewQueryRaw(`assignment`, view))
      .take(Number(pageSize))
      .skip((Number(page) - 1) * Number(pageSize))
      .orderBy(sortKey, sortValue)
      .getManyAndCount();
  }

  findByIdWithSettings(id: string) {
    return this.findOne({
      relations: ['testSettings', 'courseSettings', 'educationProgramSettings'],
      where: {
        id,
      },
    });
  }

  findById(id: string) {
    return this.findOne({
      relations: ['educationElement', 'educationProgramSettings'],
      where: {
        id,
      },
    });
  }

  findByUserIdAndEducationElementId(userId: string, educationElementId: string) {
    return this.findOne({
      relations: ['user', 'educationElement'],
      where: {
        user: {
          id: userId,
        },
        educationElement: {
          id: educationElementId,
        },
      },
    });
  }

  findUserAssignmentByEducationElementInCatalog(userId: string, educationElementId: string) {
    return this.createQueryBuilder('assignment')
      .leftJoinAndSelect('assignment.user', 'user')
      .leftJoinAndSelect('assignment.group', 'group')
      .leftJoinAndSelect('assignment.educationElement', 'educationElement')
      .leftJoinAndSelect('group.users', 'usersInGroup')
      .leftJoinAndSelect('usersInGroup.user', 'userInGroup')
      .where(`(user.id = '${userId}' OR userInGroup.id = '${userId}')`)
      .andWhere(`educationElement.id = :educationElementId`, {
        educationElementId,
      })
      .getMany();
  }

  findByGroupId(groupId: string) {
    return this.find({
      relations: ['educationElement'],
      where: {
        groupId
      }
    })
  }
}

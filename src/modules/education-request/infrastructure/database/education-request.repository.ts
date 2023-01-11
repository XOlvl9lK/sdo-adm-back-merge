import { Brackets, EntityRepository, ILike } from 'typeorm';
import {
  EducationRequestEntity,
  EducationRequestStatusEnum,
  GroupEducationRequestEntity,
  UserEducationRequestEntity,
} from '@modules/education-request/domain/education-request.entity';
import { BaseRepository } from '@core/database/base.repository';
import { RequestQuery } from '@core/libs/types';

@EntityRepository(EducationRequestEntity)
export class EducationRequestRepository extends BaseRepository<EducationRequestEntity> {
  findAll(search?: string) {
    return this.find({
      relations: ['educationElement'],
      ...(search ? { where: { educationElement: { title: ILike(`%${search}%`) } } } : {}),
    });
  }

  findById(id: string) {
    return this.findOne({
      relations: ['user', 'educationElement'],
      where: { id },
    });
  }
}

@EntityRepository(UserEducationRequestEntity)
export class UserEducationRequestRepository extends BaseRepository<UserEducationRequestEntity> {
  findById(id: string) {
    return this.findOne({
      relations: ['educationElement', 'user'],
      where: { id },
    });
  }

  findAllByUserId(userId: string, { page, pageSize, search, sort }: RequestQuery) {
    const { sortKey, sortValue } = this.processSortQueryRaw(sort);
    return this.createQueryBuilder('educationRequest')
      .leftJoinAndSelect('educationRequest.user', 'user')
      .leftJoinAndSelect('educationRequest.educationElement', 'educationElement')
      .where('user.id = :userId', { userId })
      .andWhere(`educationElement.title ILIKE '%${search || ''}%'`)
      .take(Number(pageSize))
      .skip((Number(page) - 1) * Number(pageSize))
      .orderBy(sortKey, sortValue)
      .getManyAndCount();
  }

  findByUserIdAndStatus(
    userId: string,
    status: EducationRequestStatusEnum,
    { search, page, pageSize, sort }: RequestQuery,
  ) {
    const parsedSort = JSON.parse(sort || '{}');
    const sortKey = Object.keys(parsedSort)[0];
    const sortValue = parsedSort[sortKey];
    return this.createQueryBuilder('educationRequest')
      .leftJoinAndSelect('educationRequest.user', 'user')
      .leftJoinAndSelect('educationRequest.educationElement', 'educationElement')
      .where('user.id = :userId', { userId })
      .andWhere('educationRequest.status = :status', { status })
      .andWhere(search ? `educationElement.title ilike '%${search}%'` : `educationElement.title ilike '%%'`)
      .take(Number(pageSize))
      .skip((Number(page) - 1) * Number(pageSize))
      .orderBy(sort ? sortKey : undefined, sort ? sortValue : undefined)
      .getManyAndCount();
  }

  findByUserIdAndStatusWithoutCount(
    userId: string,
    status: EducationRequestStatusEnum,
    { search, page, pageSize }: RequestQuery,
  ) {
    return this.find({
      relations: ['user', 'educationElement'],
      where: {
        user: {
          id: userId,
        },
        status: status,
        ...(search ? { educationElement: { title: ILike(`%${search}%`) } } : {}),
      },
    });
  }

  findByUserIdAndEducationElementId(educationElementId: string, userId?: string) {
    return this.find({
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

  findAllAccepted(search?: string) {
    if (search) {
      return this.find({
        relations: ['educationElement', 'user'],
        where: {
          status: EducationRequestStatusEnum.ACCEPTED,
          user: { fullName: ILike(`%${search}%`) },
        },
      });
    }
    return this.find({
      relations: ['educationElement', 'user'],
      where: {
        status: EducationRequestStatusEnum.ACCEPTED,
      },
    });
  }

  findByUserId(userId, { page, pageSize, search, view, sort }: RequestQuery) {
    const qb = this.createQueryBuilder('educationRequest')
      .leftJoinAndSelect('educationRequest.user', 'user')
      .leftJoinAndSelect('educationRequest.educationElement', 'educationElement')
      .where('user.id = :userId', { userId });
    if (view === 'active')
      qb.andWhere('status = :status', {
        status: EducationRequestStatusEnum.NOT_PROCESSED,
      });
    if (search)
      qb.andWhere('educationElement.title ILIKE :search', {
        search: `%${search.toLocaleLowerCase()}%`,
      });
    if (sort) {
      const parsedSort = JSON.parse(sort);
      const sortKey = Object.keys(parsedSort)[0];
      const sortValue = parsedSort[sortKey];
      qb.orderBy(sortKey, sortValue);
    }
    return qb
      .limit(Number(pageSize))
      .offset((Number(page) - 1) * Number(pageSize))
      .getManyAndCount();
  }

  findAllUsersRequests({ search, sort, page, pageSize }: RequestQuery) {
    const { sortKey, sortValue } = this.processSortQueryRaw(sort)
    const subSql = `
      SELECT id, fullName, institution, total, new FROM (SELECT
       "user".id,
       CASE WHEN "user"."fullName" != '' THEN "user"."fullName" ELSE "user"."login" END AS fullName,
       "user"."institution",
       (SELECT COUNT(*)
           FROM education_request
           WHERE education_request."userId" = "user".id) AS total,
       (select COUNT(*)
           FROM education_request
           WHERE education_request."userId" = "user".id AND status = 'NOT PROCESSED') AS new
       FROM "user") AS users_requests 
       WHERE (total > 0 OR new > 0) ${search ? `AND fullName ILIKE '%${search}%'` : ''}
    `

    const usersRequestsSql = `
      ${subSql}
      ${sortValue && sortKey ? `ORDER BY ${sortKey} ${sortValue}` : ''}
      ${page && page ? `
        OFFSET ${(Number(page) - 1) * Number(pageSize)}
        LIMIT ${Number(pageSize)}
      ` : ''}
    `

    const countSql = `
      SELECT COUNT(*) FROM (${subSql}) as users_requests_count
    `

    return Promise.all([this.query(usersRequestsSql), this.query(countSql)])
  }
}

@EntityRepository(GroupEducationRequestEntity)
export class GroupEducationRequestRepository extends BaseRepository<GroupEducationRequestEntity> {
  findAllAccepted(search?: string) {
    return this.find({
      relations: ['educationElement', 'group'],
      where: {
        status: EducationRequestStatusEnum.ACCEPTED,
        ...(search ? { group: { title: ILike(`%${search}%`) } } : {}),
      },
    });
  }

  findByGroupIdAndEducationElementId(groupId: string, educationElementId: string) {
    return this.findOne({
      relations: ['educationElement', 'group'],
      where: {
        group: {
          id: groupId,
        },
        educationElement: {
          id: educationElementId,
        },
      },
    });
  }
}

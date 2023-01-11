import { Between, EntityRepository, ILike, In, LessThan, MoreThan } from 'typeorm';
import { GroupEntity, UserInGroupEntity } from '@modules/group/domain/group.entity';
import { BaseRepository } from '@core/database/base.repository';
import { RequestQuery } from '@core/libs/types';
import { GetAllGroupsDto } from '@modules/group/controllers/dtos/get-all-groups.dto';

@EntityRepository(GroupEntity)
export class GroupRepository extends BaseRepository<GroupEntity> {
  findAll({ search, view, page, pageSize, sort }: RequestQuery, filter?: GetAllGroupsDto) {
    return this.findAndCount({
      where: {
        ...(search ? { title: ILike(`%${search}%`) } : {}),
        ...this.processViewQuery(view),
        ...(filter?.dateStart && filter?.dateEnd ? { createdAt: Between(filter.dateStart, filter.dateEnd) } : {}),
      },
      ...this.processPaginationQuery(page, pageSize),
      ...this.processSortQuery(sort),
    });
  }

  findById(id: string) {
    return this.findOne({ relations: ['users', 'users.user'], where: { id } });
  }

  findByIds(ids: string[]) {
    return this.find({
      relations: ['users', 'users.user'],
      where: {
        id: In(ids),
      },
    });
  }

  findByTitle(title: string) {
    return this.findOne({
      relations: ['users', 'users.user'],
      where: {
        title: ILike(`%${title}%`),
      },
    });
  }

  async isAlreadyExists(title: string) {
    return !!(await this.findOne({ where: { title } }));
  }
}

@EntityRepository(UserInGroupEntity)
export class UserInGroupRepository extends BaseRepository<UserInGroupEntity> {
  findForRegisteredReport(groupIds: string[], startDate: string, endDate: string, groupDateStart?: string, groupDateEnd?: string) {
    return this.find({
      relations: ['group', 'user', 'user.region', 'user.department', 'user.subdivision'],
      where: {
        ...(groupDateStart || groupDateEnd ? {
          group: {
            createdAt: groupDateStart && !groupDateEnd ? MoreThan(this.getLowerDateLimit(groupDateStart))
              : !groupDateStart && groupDateEnd ? LessThan(this.getUpperDateLimit(groupDateEnd))
                : Between(this.getLowerDateLimit(groupDateStart), this.getUpperDateLimit(groupDateEnd))
          }
        } : {}),
        ...(groupIds.length ? { group: { id: In(groupIds) } } : {}),
        ...(startDate && endDate
          ? {
              user: {
                createdAt: Between(this.getLowerDateLimit(startDate), this.getUpperDateLimit(endDate)),
              },
            }
          : {}),
      },
    });
  }

  findByGroupId(groupId: string, { search, view, page, pageSize, sort }: RequestQuery) {
    const { sortKey, sortValue } = this.processSortQueryRaw(sort);
    return this.createQueryBuilder('userInGroup')
      .leftJoinAndSelect('userInGroup.user', 'user')
      .leftJoinAndSelect('user.department', 'department')
      .leftJoinAndSelect('userInGroup.group', 'group')
      .where('group.id = :groupId', { groupId })
      .andWhere(`(user.fullName ILIKE '%${search || ''}%' OR user.login ILIKE '%${search || ''}%')`)
      .andWhere(this.processViewQueryRaw('user', view))
      .take(Number(pageSize))
      .skip((Number(page) - 1) * Number(pageSize))
      .orderBy(sortKey, sortValue)
      .getManyAndCount();
  }

  findWithoutGroup() {
    return this.createQueryBuilder('userInGroup')
      .leftJoinAndSelect('userInGroup.user', 'user')
      .where('userInGroup.groupId IS NULL')
      .getMany();
  }

  findByIds(ids: string[]) {
    return super.findByIds(ids, {
      relations: ['group', 'user'],
    });
  }

  findByUserId(userId: string) {
    return this.find({
      relations: ['group', 'user'],
      where: {
        user: { id: userId }
      }
    })
  }
}

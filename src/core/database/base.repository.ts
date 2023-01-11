import { FindConditions, ILike, Repository, SelectQueryBuilder } from 'typeorm';
import { BaseEntity } from 'src/core/domain/base.entity';
import { SortQuery, ViewQuery } from '@core/libs/types';
import { Brackets } from 'typeorm/query-builder/Brackets';
import { ObjectLiteral } from 'typeorm/common/ObjectLiteral';
import { endOfDay, startOfDay } from 'date-fns';

export class BaseRepository<Entity> extends Repository<Entity> {
  findById(id: string) {
    return this.findOne({ where: { id } });
  }

  async isEmpty() {
    const count = await this.count()
    return !count
  }

  protected processViewQuery(viewQuery?: ViewQuery) {
    switch (viewQuery) {
      case 'active':
        return {
          isArchived: false,
        };
      case 'archive':
        return {
          isArchived: true,
        };
      default:
        return {};
    }
  }

  protected processSortQuery(sortQuery?: string, defaultSort?: SortQuery<Entity>) {
    if (sortQuery) {
      const sort = JSON.parse(sortQuery) as SortQuery<Entity>;
      const sortKeys = Object.keys(sort)
      return {
        order: {
          ...sort,
          ...(sortKeys.includes('id') ? {} : { id: 'ASC' })
        },
      };
    } else return defaultSort ? { order: defaultSort } : {};
  }

  protected processPaginationQuery(page?: string | number, pageSize?: string | number, offset?: string | number) {
    if ((page || offset !== undefined) && pageSize) {
      return {
        skip: offset !== undefined ? Number(offset) : (Number(page) - 1) * Number(pageSize),
        take: Number(pageSize),
      };
    }
    return {};
  }

  protected processSearchQuery(search?: string, fieldName = 'title') {
    if (search) {
      return {
        [fieldName]: ILike(`%${search}%`),
      };
    }
    return {};
  }

  protected processSortQueryRaw(sortQuery?: string) {
    if (sortQuery) {
      const parsedSort = JSON.parse(sortQuery);
      const sortKey = Object.keys(parsedSort)[0];
      const sortValue = parsedSort[sortKey];
      return {
        sortKey,
        sortValue,
      };
    }
    return {
      sortKey: undefined,
      sortValue: undefined,
    };
  }

  protected processViewQueryRaw(alias: string, viewQuery?: ViewQuery) {
    if (viewQuery) {
      switch (viewQuery) {
        case 'all':
          return `("${alias}"."isArchived" = true OR "${alias}"."isArchived" = false)`;
        case 'active':
          return `"${alias}"."isArchived" = false`;
        case 'archive':
          return `"${alias}"."isArchived" = true`;
      }
    }
    return `("${alias}"."isArchived" = true OR "${alias}"."isArchived" = false)`;
  }

  protected processSkipQueryRaw(page?: string | number, pageSize?: string | number, offset?: string | number) {
    if (offset !== undefined || (pageSize && page)) {
      return offset !== undefined ? Number(offset) : (Number(page) - 1) * Number(pageSize)
    }
    return undefined
  }

  protected addWhere(
    statement: boolean,
    qb: SelectQueryBuilder<Entity>,
    where: string | Brackets | ((qb: this) => string) | ObjectLiteral | ObjectLiteral[],
    parameters?: ObjectLiteral,
  ) {
    if (statement) {
      qb.andWhere(where, parameters);
    }
  }

  protected getUpperDateLimit(date: string) {
    return endOfDay(new Date(date)).toISOString()
  }

  protected getLowerDateLimit(date: string) {
    return startOfDay(new Date(date)).toISOString()
  }
}

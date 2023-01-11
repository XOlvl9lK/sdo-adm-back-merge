import { BaseEntity } from '@core/domain/base.entity';
import { Request } from 'express';

export interface RequestWithCredentials extends Request {
  user?: {
    userId: string;
    login: string;
  };
}

export type ViewQuery = 'all' | 'active' | 'archive';

export class RequestQuery {
  search?: string;
  view?: ViewQuery;
  sort?: string;
  page?: string | number;
  pageSize?: string | number;
  offset?: string | number
}

export type SortQuery<T> = {
  [K in keyof T]?: 'ASC' | 'DESC';
};

export interface IPaginatedResponse<T> {
  total: number;
  data: T;
}

export type Constructor<T = any> = new (...args: any) => T;

import { SortQuery } from '@common/utils/types';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileHistoryStatusEnum } from '../domain/file-history-status.enum';
import { FileHistoryEntity } from '../domain/file-history.entity';

export interface FindAllFileHistory {
  page?: number;
  pageSize?: number;
  startDate?: [Date, Date];
  sort?: SortQuery;
  departmentName?: string[];
  status?: FileHistoryStatusEnum[];
}

@Injectable()
export class FindAllFileHistoryService {
  constructor(
    @InjectRepository(FileHistoryEntity)
    private fileHistoryRepo: Repository<FileHistoryEntity>,
  ) {}

  async handle({ page = 1, pageSize = 10, startDate, sort, departmentName, status }: FindAllFileHistory) {
    const qb = this.fileHistoryRepo
      .createQueryBuilder('fileHistory')
      .leftJoinAndSelect('fileHistory.integration', 'integration')
      .skip((page - 1) * pageSize)
      .take(pageSize);

    if (departmentName?.length) {
      qb.andWhere('integration.departmentName IN (:...departmentName)', { departmentName });
    }
    if (startDate?.length) {
      qb.andWhere(`fileHistory.startDate BETWEEN :start AND :finish`, {
        start: startDate[0] ? new Date(startDate[0]).toISOString() : '0',
        finish: startDate[1] ? new Date(startDate[1]).toISOString() : '0',
      });
    }
    if (status?.length) {
      qb.andWhere('fileHistory.status IN (:...status)', { status });
    }
    if (sort) {
      qb.orderBy(sort);
    }

    const [data, total] = await qb.getManyAndCount();
    return { data, total };
  }
}

import { EntityRepository, MoreThan } from 'typeorm';
import { SessionEntity } from '@modules/user/domain/session.entity';
import { RequestQuery } from '@core/libs/types';
import { BaseRepository } from '@core/database/base.repository';

@EntityRepository(SessionEntity)
export class SessionRepository extends BaseRepository<SessionEntity> {
  findByUserId(userId: string) {
    return this.findOne({
      relations: ['user'],
      where: {
        user: {
          id: userId,
        },
      },
    });
  }

  findById(id: string) {
    return this.findOne({
      relations: ['user'],
      where: {
        id,
      },
    });
  }

  findByToken(token: string) {
    return this.findOne({
      relations: ['user'],
      where: {
        refresh_token: token,
      },
    });
  }

  findAll({ page, pageSize, offset }: RequestQuery) {
    return this.findAndCount({
      select: ['id', 'createdAt', 'updatedAt', 'user', 'ip', 'lastPage'],
      relations: ['user'],
      where: {
        expirationDate: MoreThan(new Date()),
      },
      ...this.processPaginationQuery(page, pageSize, offset),
    });
  }


}

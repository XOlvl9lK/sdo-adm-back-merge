import { EntityRepository, ILike, In } from 'typeorm';
import { SmevHistoryEntity } from '@modules/smev-history/domain/smev-history.entity';
import { FindSmevHistoryDto } from '@modules/smev-history/controllers/dtos/find-smev-history.dto';
import { RepoBase } from '@common/base/repo.base';

@EntityRepository(SmevHistoryEntity)
export class SmevHistoryRepository extends RepoBase<SmevHistoryEntity> {
  async findAll({
    sort,
    createDate,
    updateDate,
    departmentName,
    state,
    pageSize,
    page,
    methodName,
  }: FindSmevHistoryDto) {
    const qb = this.createQueryBuilder('smevHistory')
      .leftJoinAndSelect('smevHistory.integration', 'integration')
      .skip((page - 1) * pageSize)
      .take(pageSize);

    if (state) {
      qb.andWhere('smevHistory.state IN (:...state)', { state });
    }

    if (methodName) {
      qb.andWhere('smevHistory.methodName IN (:...methodName)', { methodName });
    }

    if (departmentName) {
      qb.andWhere('integration.departmentName IN (:...departmentName)', { departmentName });
    }

    if (createDate) {
      qb.andWhere(`smevHistory.createDate BETWEEN :start AND :finish`, {
        start: createDate[0] ? new Date(createDate[0]).toISOString() : '0',
        finish: createDate[1] ? new Date(createDate[1]).toISOString() : '0',
      });
    }

    if (updateDate) {
      qb.andWhere(`smevHistory.updateDate BETWEEN :start AND :finish`, {
        start: updateDate[0] ? new Date(updateDate[0]).toISOString() : '0',
        finish: updateDate[1] ? new Date(updateDate[1]).toISOString() : '0',
      });
    }

    if (sort) {
      qb.orderBy(sort);
    }

    return await qb.getManyAndCount();
  }

  async findIds(ids: number[], sort?: FindSmevHistoryDto['sort']) {
    const order = sort && this.createOrdering(sort);
    return this.findByIds(ids, { order });
  }
}

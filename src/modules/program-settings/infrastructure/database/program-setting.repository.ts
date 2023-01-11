import { EntityRepository, ILike } from 'typeorm';
import { ProgramSettingsEntity } from '@modules/program-settings/domain/program-settings.entity';
import { BaseRepository } from '@core/database/base.repository';
import { RequestQuery } from '@core/libs/types';

@EntityRepository(ProgramSettingsEntity)
export class ProgramSettingRepository extends BaseRepository<ProgramSettingsEntity> {
  findAll({ page, pageSize, search, sort }: RequestQuery) {
    const { sortKey, sortValue } = this.processSortQueryRaw(sort);
    return this.createQueryBuilder('programSettings')
      .leftJoinAndSelect('programSettings.role', 'role')
      .leftJoinAndSelect('programSettings.obligatory', 'obligatory')
      .leftJoinAndSelect('programSettings.optional', 'optional')
      .where(`role.title ILIKE '%${search || ''}%'`)
      .take(Number(pageSize))
      .skip((Number(page) - 1) * Number(pageSize))
      .orderBy(sortKey, sortValue)
      .getManyAndCount();
  }

  findById(id: string) {
    return this.findOne({
      relations: ['role', 'obligatory', 'optional'],
      where: { id },
    });
  }

  findByRoleDibId(roleDibId: string) {
    return this.find({
      relations: ['role', 'obligatory', 'optional'],
      where: {
        role: { id: roleDibId },
      },
    });
  }

  async roleAlreadyHasSettings(roleDibId: string) {
    return !!(await this.findOne({ where: { roleId: roleDibId }}))
  }
}

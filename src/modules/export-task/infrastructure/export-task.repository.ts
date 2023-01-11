import { EntityRepository } from 'typeorm';
import { ExportStatusEnum, ExportTaskEntity } from '@modules/export-task/domain/export-task.entity';
import { BaseRepository } from '@core/database/base.repository';
import { RequestQuery } from '@core/libs/types';
import { maxExportWorkers } from '@modules/application-settings/infrastructure/seed-data';
import { ApplicationSettingsEntity } from '@modules/application-settings/domain/application-settings.entity';

@EntityRepository(ExportTaskEntity)
export class ExportTaskRepository extends BaseRepository<ExportTaskEntity> {
  findByUserId({ sort, page, pageSize, search }: RequestQuery, userId: string) {
    return this.findAndCount({
      where: {
        userId,
        ...this.processSearchQuery(search, 'id'),
      },
      ...this.processSortQuery(sort),
      ...this.processPaginationQuery(page, pageSize)
    })
  }

  findInProcess() {
    return this.find({
      where: {
        status: ExportStatusEnum.IN_PROCESS
      }
    })
  }

  async hasInProcessWorker() {
    const exportTasks = await this.findInProcess()
    const maxWorkers = (await this.query(`SELECT * FROM application_settings WHERE id = '${maxExportWorkers.id}'`))[0] as ApplicationSettingsEntity
    return exportTasks.length >= Number(maxWorkers.value)
  }
}
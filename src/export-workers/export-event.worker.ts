import { workerData, parentPort } from 'worker_threads'
import { GetRowDataFn } from '@core/libs/manual-xlsx-library';
import { EventEntity } from '@modules/event/domain/event.entity';
import { getClientDateAndTime } from '@core/libs/getClientDateAndTime';
import { EventRepository } from '@modules/event/infrastructure/database/event.repository';
import { ExportStatusEnum } from '@modules/export-task/domain/export-task.entity';
import { ExportTaskRepository } from '@modules/export-task/infrastructure/export-task.repository';
import {
  createWorkerConnection,
  ExportWorker,
  ExportWorkerData, GetDataInLoopFn
} from '@src/export-workers/export.worker';
import { ExportTaskProgressEvent } from '@modules/event/infrastructure/events/export-task-progress.event';

const { exportTask, dto, format } = workerData as ExportWorkerData

const getXlsxRow: GetRowDataFn<EventEntity> = (event) => ({
  'B': event.id,
  'C': event.type,
  'D': getClientDateAndTime(new Date(event.createdAt), dto.userTimezone),
  'E': event.page,
  'F': event.description || '-'
})

const getOdsRow = (event: EventEntity) => [
  event.id,
  event.type,
  getClientDateAndTime(event.createdAt, dto.userTimezone),
  event.page,
  event.description || '-'
]

const execute = async () => {
  const connection = await createWorkerConnection()
  const exportTaskRepository = connection.getCustomRepository(ExportTaskRepository)
  const eventRepository = connection.getCustomRepository(EventRepository)

  const getDataInLoop: GetDataInLoopFn<EventEntity> = ({ pageSize, offset }) => {
    const { page, ...restDto } = dto
    return eventRepository.getAll({
      ...restDto,
      pageSize,
      offset,
    })
  }
  try {
    let [, total] = await eventRepository.getAll({ ...dto, pageSize: 10 })

    const exportWorker = new ExportWorker({
      total,
      exportTask,
      dto,
      exportName: 'Журнал событий',
      firstDataRow: 4,
      getDataInLoop,
      pdfHeaderRow: [],
      onIteration: (payload) => parentPort.postMessage(payload),
    })

    const result = await exportWorker.run(format, getXlsxRow, getOdsRow, getOdsRow, getOdsRow)

    exportWorker.completeExportTask(exportTask, result)
    await exportTaskRepository.save(exportTask)
    parentPort.postMessage(new ExportTaskProgressEvent(exportTask.id, 100, exportTask.fileName, exportTask.href))
  } catch (e: any) {
    exportTask.status = ExportStatusEnum.ERROR
    exportTask.errorDescription = JSON.stringify(e.message) + ' ' + JSON.stringify(e.stack)
    await exportTaskRepository.save(exportTask)
    console.log(e)
  }
}

execute()

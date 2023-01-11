import { parentPort, workerData } from 'worker_threads';
import {
  createWorkerConnection,
  ExportWorker,
  ExportWorkerData,
  GetDataInLoopFn
} from '@src/export-workers/export.worker';
import { GetRowDataFn } from '@core/libs/manual-xlsx-library';
import { getClientDateAndTime } from '@core/libs/getClientDateAndTime';
import { PerformanceEntity } from '@modules/performance/domain/performance.entity';
import { ExportTaskRepository } from '@modules/export-task/infrastructure/export-task.repository';
import { PerformanceRepository } from '@modules/performance/infrastructure/database/performance.repository';
import { ExportStatusEnum } from '@modules/export-task/domain/export-task.entity';
import { ExportTaskProgressEvent } from '@modules/event/infrastructure/events/export-task-progress.event';

const { exportTask, dto, format } = workerData as ExportWorkerData

const getXlsxRow: GetRowDataFn<PerformanceEntity> = (performance) => ({
  'B': performance.user.login,
  'C': performance.user?.department?.title || '-',
  'D': performance.user?.subdivision?.title || '-',
  'E': performance.educationElement?.title,
  'F': performance.assignment?.group?.title || '-',
  'G': performance.result,
  'H': getClientDateAndTime(performance.startDate, dto.userTimezone),
  'I': getClientDateAndTime(performance.user.createdAt, dto.userTimezone)
})

const getOdsRow = (performance: PerformanceEntity) => [
  performance.user.login,
  performance.user?.department?.title || '-',
  performance.user?.subdivision?.title || '-',
  performance.educationElement?.title,
  performance.assignment?.group?.title || '-',
  performance.result,
  getClientDateAndTime(performance.startDate, dto.userTimezone),
  getClientDateAndTime(performance.user.createdAt, dto.userTimezone)
]

const execute = async () => {
  const connection = await createWorkerConnection()
  const exportTaskRepository = connection.getCustomRepository(ExportTaskRepository)
  const performanceRepository = connection.getCustomRepository(PerformanceRepository)

  const getDataInLoop: GetDataInLoopFn<PerformanceEntity> = ({ pageSize, offset }) => {
    const { page, ...restDto } = dto
    return performanceRepository.findForOpenSessionsReport({
      ...restDto,
      pageSize,
      offset
    })
  }

  try {
    let [, total] = await performanceRepository.findForOpenSessionsReport({ ...dto, pageSize: 10 })

    const exportWorker = new ExportWorker({
      total,
      exportTask,
      dto,
      exportName: 'Отчет по открытым сессиям пользователей',
      pdfHeaderRow: ['№ п/п', 'Логин ДОиТП', 'Ведомство', 'Подразделение', 'Программа обучения', 'Наименование группы', 'Результат, %', 'Дата начала сессии', 'Дата регистрации на портале'],
      onIteration: (payload) => parentPort.postMessage(payload),
      getDataInLoop,
      firstDataRow: 4,
      pdfColumnWidth: [20, 50, 55, 80, 70, 55, 50, 55, 65]
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
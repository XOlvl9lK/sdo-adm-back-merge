import { parentPort, workerData } from 'worker_threads';
import {
  createWorkerConnection,
  ExportWorker,
  ExportWorkerData,
  GetDataInLoopFn
} from '@src/export-workers/export.worker';
import { GetRowDataFn } from '@core/libs/manual-xlsx-library';
import { getClientDateAndTime } from '@core/libs/getClientDateAndTime';
import { SessionEntity } from '@modules/user/domain/session.entity';
import { ExportTaskRepository } from '@modules/export-task/infrastructure/export-task.repository';
import { SessionRepository } from '@modules/user/infrastructure/database/session.repository';
import { ExportStatusEnum } from '@modules/export-task/domain/export-task.entity';
import { ExportTaskProgressEvent } from '@modules/event/infrastructure/events/export-task-progress.event';

const { exportTask, dto, format } = workerData as ExportWorkerData

const getXlsxRow: GetRowDataFn<SessionEntity> = (session) => ({
  'B': session.id,
  'C': session.user.login,
  'D': session.user.fullName || '-',
  'E': session.ip,
  'F': session.lastPage,
  'G': getClientDateAndTime(new Date(session.createdAt), dto.userTimezone),
  'H': getClientDateAndTime(new Date(session.updatedAt), dto.userTimezone)
})

const getOdsRow = (session: SessionEntity) => [
  session.id,
  session.user.login,
  session.user.fullName || '-',
  session.ip,
  session.lastPage,
  getClientDateAndTime(new Date(session.createdAt), dto.userTimezone),
  getClientDateAndTime(new Date(session.updatedAt), dto.userTimezone)
]

const execute = async () => {
  const connection = await createWorkerConnection()
  const exportTaskRepository = connection.getCustomRepository(ExportTaskRepository)
  const sessionRepository = connection.getCustomRepository(SessionRepository)

  const getDataInLoop: GetDataInLoopFn<SessionEntity> = ({ pageSize, offset }) => {
    const { page, ...restDto } = dto
    return sessionRepository.findAll({
      ...restDto,
      pageSize,
      offset
    })
  }

  try {
    let [, total] = await sessionRepository.findAll({ ...dto, pageSize: 10 })

    const exportWorker = new ExportWorker({
      getDataInLoop,
      total,
      exportTask,
      dto,
      exportName: 'Активные сессии пользователей',
      firstDataRow: 4,
      pdfHeaderRow: ['№ п/п', 'ID сессии', 'Логин', 'Ф.И.О.', 'IP', 'Последнее посещение', 'Время создания', 'Последняя активность'],
      onIteration: (payload) => parentPort.postMessage(payload)
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
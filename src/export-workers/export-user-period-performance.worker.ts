import { parentPort, workerData } from 'worker_threads';
import {
  createWorkerConnection,
  ExportWorker,
  ExportWorkerData,
  GetDataInLoopFn
} from '@src/export-workers/export.worker';
import { GetRowDataFn } from '@core/libs/manual-xlsx-library';
import { EventEntity } from '@modules/event/domain/event.entity';
import { getClientDate, getClientDateAndTime } from '@core/libs/getClientDateAndTime';
import { GetUserPeriodPerformanceDto } from '@modules/control/controllers/dtos/get-user-period-performance.dto';
import { PerformanceEntity } from '@modules/performance/domain/performance.entity';
import { ExportTaskRepository } from '@modules/export-task/infrastructure/export-task.repository';
import { PerformanceRepository } from '@modules/performance/infrastructure/database/performance.repository';
import { ExportStatusEnum } from '@modules/export-task/domain/export-task.entity';
import { ExportTaskProgressEvent } from '@modules/event/infrastructure/events/export-task-progress.event';
import { UserRepository } from '@modules/user/infrastructure/database/user.repository';

const { exportTask, dto, format } = workerData as ExportWorkerData<GetUserPeriodPerformanceDto>

const getXlsxRow: GetRowDataFn<PerformanceEntity> = (performance) => ({
  'B': performance.user.login,
  'C': performance.user?.department?.title || '-',
  'D': performance.user?.subdivision?.title || '-',
  'E': performance.educationElement.title,
  'F': performance.result,
  'G': performance.status,
  'H': getClientDateAndTime(performance.user.createdAt, dto.userTimezone),
})

const getOdsRow = (performance: PerformanceEntity) => [
  performance.user.login,
  performance.user?.department?.title || '-',
  performance.user?.subdivision?.title || '-',
  performance.educationElement.title,
  performance.result,
  performance.status,
  getClientDateAndTime(performance.user.createdAt, dto.userTimezone),
]

const execute = async () => {
  const connection = await createWorkerConnection()
  const exportTaskRepository = connection.getCustomRepository(ExportTaskRepository)
  const performanceRepository = connection.getCustomRepository(PerformanceRepository)
  const userRepository = connection.getCustomRepository(UserRepository)
  const user = await userRepository.findById(dto.userId)

  const getDataInLoop: GetDataInLoopFn<PerformanceEntity> = ({ pageSize, offset }) => {
    const { page, ...restDto } = dto
    return performanceRepository.findUserPeriodPerformance(dto.userId, dto.dateStart, dto.dateEnd, {
      ...restDto,
      pageSize,
      offset
    })
  }

  try {
    let [, total] = await performanceRepository.findUserPeriodPerformance(dto.userId, dto.dateStart, dto.dateEnd, { ...dto, pageSize: 10 })

    const exportWorker = new ExportWorker({
      getDataInLoop,
      total,
      exportTask,
      dto,
      exportName: 'Отчет по обучению пользователя за период',
      firstDataRow: 7,
      pdfHeaderRow: ['№ п/п', 'Логин ДОиТП', 'Ведомство', 'Подразделение', 'Программа обучения', 'Результат, %', 'Статус', 'Дата регистрации на портале'],
      onIteration: (payload) => parentPort.postMessage(payload),
      pdfFilters: [
        {
          text: [
            { text: 'Пользователь: ', style: 'boldText', margin: [0, 5] },
            user.login
          ]
        }, {
          text: [
            { text: 'Период: ', style: 'boldText', margin: [0, 5] },
            `${getClientDate(new Date(dto.dateStart), dto.userTimezone)} - ${getClientDate(new Date(dto.dateEnd), dto.userTimezone)}`
          ]
        }
      ],
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
import { parentPort, workerData } from 'worker_threads';
import {
  createWorkerConnection,
  ExportWorker,
  ExportWorkerData,
  GetDataInLoopFn
} from '@src/export-workers/export.worker';
import { GetRowDataFn } from '@core/libs/manual-xlsx-library';
import { GetUserPerformanceDto } from '@modules/control/controllers/dtos/get-user-performance.dto';
import { PerformanceEntity } from '@modules/performance/domain/performance.entity';
import { ExportTaskRepository } from '@modules/export-task/infrastructure/export-task.repository';
import { PerformanceRepository } from '@modules/performance/infrastructure/database/performance.repository';
import { ExportStatusEnum } from '@modules/export-task/domain/export-task.entity';
import { ExportTaskProgressEvent } from '@modules/event/infrastructure/events/export-task-progress.event';
import { UserRepository } from '@modules/user/infrastructure/database/user.repository';

const { exportTask, dto, format } = workerData as ExportWorkerData<GetUserPerformanceDto>

const getXlsxRow: GetRowDataFn<PerformanceEntity> = (performance) => ({
  'B': performance.educationElement.title,
  'C': performance.assignment?.group?.title || '-',
  'D': performance.result,
  'E': performance.status,
})

const getOdsRow = (performance: PerformanceEntity) => [
  performance.educationElement.title,
  performance.assignment?.group?.title || '-',
  performance.result,
  performance.status,
]

const execute = async () => {
  const connection = await createWorkerConnection()
  const exportTaskRepository = connection.getCustomRepository(ExportTaskRepository)
  const performanceRepository = connection.getCustomRepository(PerformanceRepository)
  const userRepository = connection.getCustomRepository(UserRepository)
  const user = await userRepository.findById(dto.userId)

  const getDataInLoop: GetDataInLoopFn<PerformanceEntity> = ({ pageSize, offset }) => {
    const { page, ...restDto } = dto
    return performanceRepository.findUserPerformance(dto.userId, {
      ...restDto,
      pageSize,
      offset
    })
  }

  try {
    let [, total] = await performanceRepository.findUserPerformance(dto.userId, { ...dto, pageSize: 10 })

    const exportWorker = new ExportWorker({
      getDataInLoop,
      total,
      exportTask,
      dto,
      exportName: 'Отчет успеваемости пользователя',
      firstDataRow: 6,
      pdfHeaderRow: ['№ п/п', 'Программа обучения', 'Наименование группы', 'Результат, %', 'Статус'],
      pdfFilters: [
        {
          text: [
            { text: 'Пользователь: ', style: 'boldText', margin: [0, 5] },
            user.login
          ]
        }
      ],
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
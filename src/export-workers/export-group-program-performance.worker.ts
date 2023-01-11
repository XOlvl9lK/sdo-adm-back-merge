import { parentPort, workerData } from 'worker_threads';
import {
  createWorkerConnection,
  ExportWorker,
  ExportWorkerData,
  GetDataInLoopFn
} from '@src/export-workers/export.worker';
import { GetRowDataFn } from '@core/libs/manual-xlsx-library';
import { getClientDate, getClientDateAndTime } from '@core/libs/getClientDateAndTime';
import { PerformanceEntity } from '@modules/performance/domain/performance.entity';
import { ExportTaskRepository } from '@modules/export-task/infrastructure/export-task.repository';
import { GroupRepository } from '@modules/group/infrastructure/database/group.repository';
import { PerformanceRepository } from '@modules/performance/infrastructure/database/performance.repository';
import { GetGroupProgramPerformanceDto } from '@modules/control/controllers/dtos/get-group-program-performance.dto';
import { ExportStatusEnum } from '@modules/export-task/domain/export-task.entity';
import { ExportTaskProgressEvent } from '@modules/event/infrastructure/events/export-task-progress.event';
import {
  EducationProgramRepository
} from '@modules/education-program/infrastructure/database/education-program.repository';

const { exportTask, dto, format } = workerData as ExportWorkerData<GetGroupProgramPerformanceDto>

const getXlsxRow: GetRowDataFn<PerformanceEntity> = (performance) => ({
  'B': performance.user.login,
  'C': performance.user?.department?.title || '-',
  'D': performance.user?.subdivision?.title || '-',
  'E': performance.result,
  'F': performance.status,
  'G': getClientDateAndTime(new Date(performance.user.createdAt), dto.userTimezone),
})

const getOdsRow = (performance: PerformanceEntity) => [
  performance.user.login,
  performance.user?.department?.title || '-',
  performance.user?.subdivision?.title || '-',
  performance.result,
  performance.status,
  getClientDateAndTime(new Date(performance.user.createdAt), dto.userTimezone),
]

const execute = async () => {
  const connection = await createWorkerConnection()
  const groupRepository = connection.getCustomRepository(GroupRepository)
  const performanceRepository = connection.getCustomRepository(PerformanceRepository)
  const exportTaskRepository = connection.getCustomRepository(ExportTaskRepository)
  const educationProgramRepository = connection.getCustomRepository(EducationProgramRepository)

  const program = await educationProgramRepository.findById(dto.programId)
  const group = await groupRepository.findById(dto.groupId)
  const userIds = group.users.map(u => u.user.id)

  const getDataInLoop: GetDataInLoopFn<PerformanceEntity> = ({ pageSize, offset }) => {
    return performanceRepository.findGroupProgramPerformance(
      dto.programId,
      dto.groupId,
      dto.dateStart,
      dto.dateEnd,
      {
        sort: dto.sort,
        pageSize,
        offset
      }
    )
  }

  try {
    let [, total] = await performanceRepository.findGroupProgramPerformance(
      dto.programId,
      dto.groupId,
      dto.dateStart,
      dto.dateEnd,
      {
        ...dto,
        pageSize: 10
      }
    )

    const exportWorker = new ExportWorker({
      total,
      exportTask,
      dto,
      exportName: 'Отчет по обучению группы по программе обучения',
      firstDataRow: 8,
      pdfHeaderRow: ['№ п/п', 'Логин ДОиТП', 'Ведомство', 'Подразделение', 'Результат, %', 'Статус', 'Дата регистрации на портале'],
      getDataInLoop,
      onIteration: (payload) => parentPort.postMessage(payload),
      pdfFilters: [
        {
          text: [
            { text: 'Группа: ', style: 'boldText', margin: [0, 5] },
            group.title
          ]
        }, {
          text: [
            { text: 'Программа обучения: ', style: 'boldText', margin: [0, 5] },
            program.title
          ]
        }, {
          text: [
            { text: 'Период: ', style: 'boldText', margin: [0, 5] },
            `${getClientDate(new Date(dto.dateStart), dto.userTimezone)} - ${getClientDate(new Date(dto.dateEnd), dto.userTimezone)}`
          ]
        }
      ]
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
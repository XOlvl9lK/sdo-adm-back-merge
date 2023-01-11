import { parentPort, workerData } from 'worker_threads';
import {
  createWorkerConnection,
  ExportWorker,
  ExportWorkerData,
  GetDataInLoopFn
} from '@src/export-workers/export.worker';
import { GetRowDataFn } from '@core/libs/manual-xlsx-library';
import { getClientDate, getClientDateAndTime } from '@core/libs/getClientDateAndTime';
import { FindRegisteredUsersDto } from '@modules/other/controllers/dtos/find-registered-users.dto';
import { ExportTaskRepository } from '@modules/export-task/infrastructure/export-task.repository';
import { UserRepository } from '@modules/user/infrastructure/database/user.repository';
import { ExportStatusEnum } from '@modules/export-task/domain/export-task.entity';
import { ExportTaskProgressEvent } from '@modules/event/infrastructure/events/export-task-progress.event';

type RegisteredUsersData = {
  completed_programs: string
  createdAt: string
  department_title?: string
  id: string
  isArchived: boolean
  login: string
  subdivision_title?: string
}

const { exportTask, dto, format } = workerData as ExportWorkerData<FindRegisteredUsersDto>

const getXlsxRow: GetRowDataFn<RegisteredUsersData> = (data) => ({
  'B': data.login,
  'C': data.department_title || '-',
  'D': data.subdivision_title || '-',
  'E': data.completed_programs || '-',
  'F': getClientDateAndTime(new Date(data.createdAt), dto.userTimezone),
})

const getOdsRow = (data: RegisteredUsersData) => [
  data.login,
  data.department_title || '-',
  data.subdivision_title || '-',
  data.completed_programs || '-',
  getClientDateAndTime(new Date(data.createdAt), dto.userTimezone),
]

const execute = async () => {
  const connection = await createWorkerConnection()
  const exportTaskRepository = connection.getCustomRepository(ExportTaskRepository)
  const userRepository = connection.getCustomRepository(UserRepository)

  const getDataInLoop: GetDataInLoopFn<RegisteredUsersData> = ({ pageSize, offset }) => {
    const { page, ...restDto } = dto
    return userRepository.findByDateFilter(dto.dateStart, dto.dateEnd, {
      ...restDto,
      pageSize,
      offset
    })
  }

  try {
    let [, total] = await userRepository.findByDateFilter(dto.dateStart, dto.dateEnd, { ...dto, pageSize: 10 })

    const exportWorker = new ExportWorker({
      getDataInLoop,
      total,
      exportTask,
      dto,
      exportName: 'Отчет по зарегистрированным пользователям',
      firstDataRow: 6,
      pdfHeaderRow: ['№ п/п', 'Логин ДОиТП', 'Ведомство', 'Подразделение', 'Количество пройденных программ обучения', 'Дата регистрации на портале'],
      onIteration: (payload) => parentPort.postMessage(payload),
      pdfFilters: [
        {
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
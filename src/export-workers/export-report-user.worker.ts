import { parentPort, workerData } from 'worker_threads';
import {
  createWorkerConnection,
  ExportWorker,
  ExportWorkerData,
  GetDataInLoopFn
} from '@src/export-workers/export.worker';
import { GetRowDataFn } from '@core/libs/manual-xlsx-library';
import { getClientDateAndTime } from '@core/libs/getClientDateAndTime';
import { RequestQuery } from '@core/libs/types';
import { GetReportUserCourseDto } from '@modules/control/controllers/dtos/get-report-user-course.dto';
import { ExportTaskRepository } from '@modules/export-task/infrastructure/export-task.repository';
import { PerformanceRepository } from '@modules/performance/infrastructure/database/performance.repository';
import { PerformanceEntity } from '@modules/performance/domain/performance.entity';
import { ExportStatusEnum } from '@modules/export-task/domain/export-task.entity';
import { ExportTaskProgressEvent } from '@modules/event/infrastructure/events/export-task-progress.event';

const { exportTask, dto, format } = workerData as ExportWorkerData<GetReportUserCourseDto>

const getXlsxRow: GetRowDataFn<PerformanceEntity> = (performance) => ({
  'B': performance.user.login,
  'C': performance.user?.department?.title || '-',
  'D': performance.user?.subdivision?.title || '-',
  'E': performance.educationElement.title,
  'F': performance.assignment?.group?.title || '-',
  'G': performance.result,
  'H': performance.status,
  'I': getClientDateAndTime(new Date(performance.user.createdAt), dto.userTimezone)
})

const getOdsRow = (performance: PerformanceEntity) => [
  performance.user.login,
  performance.user?.department?.title || '-',
  performance.user?.subdivision?.title || '-',
  performance.educationElement.title,
  performance.assignment?.group?.title || '-',
  performance.result,
  performance.status,
  getClientDateAndTime(new Date(performance.user.createdAt), dto.userTimezone)
]

const execute = async () => {
  const connection = await createWorkerConnection()
  const exportTaskRepository = connection.getCustomRepository(ExportTaskRepository)
  const performanceRepository = connection.getCustomRepository(PerformanceRepository)

  const getData = async (requestQuery: RequestQuery) => {
    const courseIdArr = Array.isArray(dto.courseId) ? dto.courseId : [dto.courseId].filter(Boolean);
    const programIdArr = Array.isArray(dto.programId) ? dto.programId : [dto.programId].filter(Boolean);
    const userIdArr = Array.isArray(dto.userId) ? dto.userId : [dto.userId].filter(Boolean);
    let groupIdsArray = Array.isArray(dto.groupIds) ? dto.groupIds : [dto.groupIds].filter(Boolean)
    return await performanceRepository.findForReportUser(
      dto.dateStart,
      dto.dateEnd,
      dto.type,
      requestQuery,
      userIdArr,
      courseIdArr,
      programIdArr,
      dto.subdivisionId,
      dto.departmentId,
      groupIdsArray
    )
  }

  const getDataInLoop: GetDataInLoopFn<PerformanceEntity> = ({ pageSize, offset }) => {
    const { page, ...restDto } = dto
    return getData({
      ...restDto,
      pageSize,
      offset
    })
  }

  try {
    let [, total] = await getData({ ...dto, pageSize: 10 })
    total -= 10

    const exportWorker = new ExportWorker({
      getDataInLoop,
      total,
      exportTask,
      dto,
      exportName: 'Аудит успеваемости пользователей по заданным элементам обучения',
      firstDataRow: 8,
      pdfHeaderRow: [],
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
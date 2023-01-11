import { parentPort, workerData } from 'worker_threads';
import {
  createWorkerConnection,
  ExportWorker,
  ExportWorkerData,
  GetDataInLoopFn,
} from '@src/export-workers/export.worker';
import { GetRowDataFn } from '@core/libs/manual-xlsx-library';
import { getClientDateAndTime } from '@core/libs/getClientDateAndTime';
import { GetRegisteredReportDto } from '@modules/control/controllers/dtos/get-registered-report.dto';
import { ExportTaskRepository } from '@modules/export-task/infrastructure/export-task.repository';
import { RequestQuery } from '@core/libs/types';
import { ExportStatusEnum } from '@modules/export-task/domain/export-task.entity';
import { ExportTaskProgressEvent } from '@modules/event/infrastructure/events/export-task-progress.event';
import {
  ControlRepository,
  RegisteredPerformanceReportItem,
} from '@modules/control/infrastructure/database/control.repository';

const { exportTask, dto, format } = workerData as ExportWorkerData<GetRegisteredReportDto>;

const getXlsxRow: GetRowDataFn<RegisteredPerformanceReportItem> = report => ({
  'B': report.regionTitle || '-',
  'C': report.departmentTitle || '-',
  'D': report.subdivisionTitle || '-',
  'E': report.groupTitle || '-',
  'F': report.userCount,
  'G': report.completedEducation,
  'H': report.completedEducationPercentage,
  'I': report.userAddedCountLastMonth,
  'J': report.userAddedCountLastMonthPercentage,
  'K': report.completedEducationLastMonth,
  'L': report.completedEducationLastMonthPercentage,
  'M': report.notCompletedEducation,
  'N': report.notCompletedEducationPercentage,
  'O': getClientDateAndTime(new Date(report.groupCreatedAt), dto.userTimezone) || '-',
});

const getOdsRow = (report: RegisteredPerformanceReportItem) => [
  report.regionTitle || '-',
  report.departmentTitle || '-',
  report.subdivisionTitle || '-',
  report.groupTitle || '-',
  report.userCount,
  report.completedEducation,
  report.completedEducationPercentage,
  report.userAddedCountLastMonth,
  report.userAddedCountLastMonthPercentage,
  report.completedEducationLastMonth,
  report.completedEducationLastMonthPercentage,
  report.notCompletedEducation,
  report.notCompletedEducationPercentage,
  getClientDateAndTime(new Date(report.groupCreatedAt), dto.userTimezone) || '-',
];

const execute = async () => {
  const connection = await createWorkerConnection();
  const exportTaskRepository = connection.getCustomRepository(ExportTaskRepository);
  const controlRepository = new ControlRepository(connection);

  const getData = async (requestQuery: RequestQuery) => {
    return await controlRepository.getRegisteredReportPerformance(dto);
  };

  const getDataInLoop: GetDataInLoopFn<RegisteredPerformanceReportItem> = ({ pageSize, offset }) => {
    const { page, ...restDto } = dto;
    return getData({
      ...restDto,
      pageSize,
      offset,
    });
  };

  try {
    const [, total] = await getData({ ...dto, pageSize: 10 });

    const exportWorker = new ExportWorker({
      getDataInLoop,
      total,
      exportTask,
      dto,
      exportName: 'Сводный аудит по успеваемости зарегистрированных пользователей',
      firstDataRow: 9,
      pdfHeaderRow: [],
      onIteration: payload => parentPort.postMessage(payload),
    });

    const result = await exportWorker.run(format, getXlsxRow, getOdsRow, getOdsRow, getOdsRow);

    exportWorker.completeExportTask(exportTask, result);
    await exportTaskRepository.save(exportTask);
    parentPort.postMessage(new ExportTaskProgressEvent(exportTask.id, 100, exportTask.fileName, exportTask.href));
  } catch (e) {
    exportTask.status = ExportStatusEnum.ERROR;
    exportTask.errorDescription = JSON.stringify(e);
    await exportTaskRepository.save(exportTask);
    console.log(e);
  }
};

execute();

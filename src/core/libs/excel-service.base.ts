import * as XLSX from 'xlsx';
import { chunk } from 'lodash';
import { ExcelHelper } from '@modules/control/infrastructure/excel.helper';
import { Response } from 'express';
import { FileService } from '@modules/file/infrastructure/file.service';
import { CreateExportTaskService } from '@modules/export-task/application/create-export-task.service';
import { ExportPageEnum } from '@modules/export-task/domain/export-task.entity';
import { Worker } from 'worker_threads';
import { getExportWorkerPath } from '@core/libs/getExportWorkerPath';
import { UpdateExportTaskService } from '@modules/export-task/application/update-export-task.service';
import { ExportTaskProgressEvent } from '@modules/event/infrastructure/events/export-task-progress.event';
import { ExportTaskRepository } from '@modules/export-task/infrastructure/export-task.repository';
import { ExportTaskException } from '@modules/export-task/infrastructure/export-task.exception';

export type ExportFormat = 'xls' | 'xlsx' | 'ods' | 'pdf'

export class ExcelServiceBase {
  protected readonly chunkSize = {
    xlsx: 900000,
    xls: 65000,
  };

  constructor(
    protected fileName: {
      xlsx: (userTimezone: number, number?: number) => string;
      xls: (userTimezone: number, number?: number) => string;
      ods?: (userTimezone: number, number?: number) => string;
      native: string;
    },
    protected fileService: FileService,
    protected createExportTaskService: CreateExportTaskService,
    protected updateExportTaskService: UpdateExportTaskService,
    protected exportTaskRepository: ExportTaskRepository
  ) {}

  private async convertFormat(
    inputBuffer: Buffer,
    format: 'xls' | 'ods',
    columnWidth?: Array<{ key: string; width: number }>,
  ): Promise<Buffer> {
    const workBook = await XLSX.read(inputBuffer, { type: 'buffer' });
    const ws = workBook.Sheets['Лист1'];
    if (columnWidth) {
      ws['!cols'] = columnWidth.map(cw => ({ width: cw.width }));
    }

    return await XLSX.write(workBook, {
      bookType: format,
      type: 'buffer',
    });
  }

  private async chunkFiles<Dto, Data>(
    excelCreator: (dto: Dto, data: Data[]) => Promise<ExcelHelper>,
    dto: Dto,
    data: Data[],
    chunkSize: number,
  ) {
    const chunkedData = chunk(data, chunkSize);
    const buffers = await Promise.all(
      chunkedData.map(chunk => excelCreator(dto, chunk).then(excel => excel.writeBuffer())),
    );
    const columnWidth = (await excelCreator(dto, chunkedData[0])).getColumnWidth();
    return { buffers, columnWidth };
  }

  protected writeContentHeader(response: Response, filename: string): void {
    response.setHeader('Content-Disposition', `attachment; filename=${encodeURI(filename)}`);
  }

  protected get createDateString() {
    const date = new Date();
    return `${date.toLocaleDateString()}_${date.toLocaleTimeString().split(':').join('.')}`;
  }

  protected async exportFile<Dto extends { userTimezone: number }, Data>(
    excelCreator: (dto: Dto, data: Data[]) => Promise<ExcelHelper>,
    dto: Dto,
    data: Data[],
    format: ExportFormat,
    response: Response,
  ) {
    const excel = await excelCreator(dto, data);
    const columnWidth = excel.getColumnWidth();
    if (format === 'xlsx') {
      this.writeContentHeader(response, this.fileName.xlsx(dto.userTimezone));
      return excel.write(response);
    } else if (format !== 'pdf') {
      const inputBuffer = await excel.writeBuffer();
      const outputBuffer = await this.convertFormat(inputBuffer, format, columnWidth);
      this.writeContentHeader(response, format === 'xls' ? this.fileName.xls(dto.userTimezone) : this.fileName.ods(dto.userTimezone));
      return response.end(outputBuffer);
    }
  }

  protected async createTemporaryExcelFileWithTask<Dto extends { userTimezone: number }, Data>(
    excelCreator: (dto: Dto, data: Data[]) => Promise<ExcelHelper>,
    dto: Dto,
    data: Data[],
    format: ExportFormat,
    userId: string,
    page: ExportPageEnum
  ) {
    const exportTask = await this.createExportTaskService.create({ userId, page })
    if (format !== 'pdf') {
      const excelObject = await excelCreator(dto, data)
      let excelBuffer: Buffer = await excelObject.writeBuffer()
      if (format !== 'xlsx') {
        excelBuffer = await this.convertFormat(excelBuffer, format)
      }
      await this.fileService.save('temp_' + exportTask.id, excelBuffer)
    }
    return exportTask
  }

  protected async exportLargeData<Dto extends { userTimezone: number }, Data>(
    excelCreator: (dto: Dto, data: Data[]) => Promise<ExcelHelper>,
    dto: Dto,
    workerName: string,
    userId: string,
    format: ExportFormat,
    page: ExportPageEnum
  ) {
    if (await this.exportTaskRepository.hasInProcessWorker()) ExportTaskException.HasInProcessWorker()
    const exportTask = await this.createTemporaryExcelFileWithTask(excelCreator, dto, [], format, userId, page)
    const worker = new Worker(
      getExportWorkerPath(workerName),
      {
        workerData: {
          exportTask,
          dto,
          format
        },
      }
    )
    worker.on('message', (payload: ExportTaskProgressEvent) => {
      this.updateExportTaskService.update({ id: exportTask.id, ...payload })
    })

    return exportTask
  }
}

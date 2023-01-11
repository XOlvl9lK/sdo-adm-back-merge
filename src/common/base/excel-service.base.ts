import { Response } from 'express';
import { ExcelHelper } from '@modules/excel/infrastructure/excel.helper';
import { chunk } from 'lodash';
import * as XLSX from 'xlsx';
import { Injectable } from '@nestjs/common';
import { applyTimezoneToDate, formatDate, getUserTimezone } from '@common/utils/getClientDateAndTime';
import { writeFile } from 'fs';
import { join } from 'path';
import { ExportJob } from '@modules/export-job/domain/export-job';
import { ListRequestDto } from '@common/utils/types';

interface ExcelFileNamePattern {
  xlsx: string;
  xls: string;
  ods?: string;
  native: string;
}

export type ExportFormat = 'xls' | 'xlsx' | 'ods';

@Injectable()
export class ExcelServiceBase {
  protected readonly chunkSize = {
    xlsx: 900000,
    xls: 65000,
  };

  constructor(protected filenamePattern: ExcelFileNamePattern) {}

  private async convertFormat(inputBuffer: Buffer, format: 'xls' | 'ods', columnWidth?: number[]): Promise<Buffer> {
    const workBook = await XLSX.read(inputBuffer, { type: 'buffer' });
    if (columnWidth.length) {
      const ws = workBook.Sheets['Лист1'];
      ws['!cols'] = columnWidth.map((cw) => ({ width: cw }));
    }

    return await XLSX.write(workBook, {
      bookType: format,
      type: 'buffer',
    });
  }

  private async chunkFiles<Dto, Data>(
    excelCreator: (dto: Dto, data: Data[]) => ExcelHelper,
    dto: Dto,
    data: Data[],
    chunkSize: number,
  ) {
    const chunkedData = chunk(data, chunkSize);
    const buffers = await Promise.all(chunkedData.map((chunk) => excelCreator(dto, chunk).writeBuffer()));
    const columnWidth = excelCreator(dto, chunkedData[0]).getColumnWidthForOtherFormats();
    return { buffers, columnWidth };
  }

  protected writeContentHeader(response: Response, filename: string): void {
    response.setHeader('Content-Disposition', `attachment; filename=${encodeURI(filename)}`);
  }

  protected generateFilename(fileFormat: keyof ExcelFileNamePattern, userTimezone?: string, index?: number): string {
    const filename = this.filenamePattern[fileFormat];
    const timezone = userTimezone ? getUserTimezone(userTimezone) : '+00:00';
    const dateWithTimezone = applyTimezoneToDate(new Date().toISOString(), timezone);
    const date = formatDate(dateWithTimezone, "dd.MM.yyyy'_'HH.mm.ss");
    const formatted = filename.replace('{date}', date).replace('_{index}', index ? `_${index}` : '');
    return `${formatted}.${fileFormat === 'native' ? 'zip' : fileFormat}`;
  }

  protected async exportFile<Dto extends { timeZone?: string }, Data = any[]>(
    excelCreator: (dto: Dto, data: Data) => ExcelHelper,
    dto: Dto,
    data: Data,
    format: 'xlsx' | 'xls' | 'ods',
    response: Response,
  ) {
    const filename = this.generateFilename(format, dto.timeZone);
    this.writeContentHeader(response, filename);
    const excel = excelCreator(dto, data);
    const columnWidth = excel.getColumnWidthForOtherFormats();
    if (format === 'xlsx') return excel.write(response);
    else {
      const inputBuffer = await excel.writeBuffer();
      const outputBuffer = await this.convertFormat(inputBuffer, format, columnWidth);
      return response.end(outputBuffer);
    }
  }

  protected async createTemporaryFile<Dto extends ListRequestDto & { timeZone?: string }, Data>(
    excelCreator: (dto: Dto, data: Data[]) => ExcelHelper,
    dto: Dto,
    format: ExportFormat,
    exportJob: ExportJob,
  ) {
    const excelObject = excelCreator(dto, []);
    let excelBuffer: Buffer = await excelObject.writeBuffer();
    if (format !== 'xlsx') {
      excelBuffer = await this.convertFormat(excelBuffer, format);
    }
    await this.saveTemporaryFile(join(process.cwd(), 'temp', 'temp_' + exportJob.id), excelBuffer);
  }

  private saveTemporaryFile(path: string, file: Buffer) {
    return new Promise<void>((resolve, reject) => {
      writeFile(path, file, (err) => {
        if (err) reject(err);
        resolve();
      });
    });
  }
}

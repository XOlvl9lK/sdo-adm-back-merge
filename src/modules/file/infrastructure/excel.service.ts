import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import * as exceljs from 'exceljs';
import internal from 'stream';

interface HeaderCell<T> {
  title: string;
  key: keyof T;
}

type RowCell<T> = {
  [K in keyof T]: any;
};

@Injectable()
export class ExcelService {
  /** filename должен содержать расширение файла */
  public async prepareResponse(response: Response, filename: string) {
    const encodedFileName = encodeURIComponent(filename);
    response.setHeader('Content-Disposition', `attachment; filename=${encodedFileName}`);
  }

  public async createExcelWorkbook(stream: internal.Writable, handler: (workbook: exceljs.Workbook) => Promise<void>) {
    const workbook = new exceljs.stream.xlsx.WorkbookWriter({
      stream,
    });
    await handler(workbook);
    workbook.commit();
    stream.end();
  }

  public async createExcelTable<T = unknown>(
    workSheet: exceljs.Worksheet,
    headers: HeaderCell<T>[],
    rows: RowCell<T>[],
  ): Promise<void> {
    workSheet.addRow(headers.map(e => e.title));
    rows.forEach(row => workSheet.addRow(headers.map(header => row[header.title])));
  }
}

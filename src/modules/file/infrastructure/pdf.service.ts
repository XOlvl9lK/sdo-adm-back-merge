import { Injectable } from '@nestjs/common';
import * as PDFDocument from 'pdfkit-table';
import stream from 'stream';
import { FileSystemService } from 'src/modules/file/infrastructure/file-system.service';
import { join } from 'path';
import { Response } from 'express';

interface HeaderCell<T> {
  title: string;
  key: keyof T;
}

type RowCell<T> = {
  [K in keyof T]: string;
};

@Injectable()
export class PdfService {
  constructor(private fileSystemService: FileSystemService) {}

  /** filename должен содержать расширение файла */
  public async prepareResponse(response: Response, filename: string) {
    response.setHeader('Content-Disposition', `attachment; filename=${filename}`);
  }

  public async createPdfTable<T = any>(
    writableStream: stream.Writable,
    headerCells: HeaderCell<T>[],
    rowCells: RowCell<T>[],
    margin = 10,
  ): Promise<void> {
    // @ts-ignore
    const doc = new PDFDocument({ margin, size: 'A4' });

    const headers: string[] = headerCells.map(e => e.title);
    const rows: string[][] = rowCells.map(row => headerCells.map(headerProp => row[headerProp.key] || ''));

    /**
     * Костыль библиотеки. Стандартный шрифт не поддерживает русский язык.
     * Для этого используем буффер и помещаем его в doc.font()
     */
    const font = await this.fileSystemService.readAsBuffer(join(process.cwd(), 'static', 'font.ttf'));

    doc.table(
      { headers, rows },
      {
        prepareHeader: () => doc.font(font).fontSize(8),
        prepareRow: () => doc.font(font).fontSize(8),
      },
    );

    doc.pipe(writableStream);
    doc.end();
  }
}

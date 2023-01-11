import * as ExcelJs from 'exceljs';
import internal from 'stream';
import { Response } from 'express';

export type Cell = {
  index: string;
  value: string | number;
  alignment?: Partial<ExcelJs.Alignment>;
};

export class ExcelHelper {
  private readonly workbook: ExcelJs.Workbook;
  private readonly sheet: ExcelJs.Worksheet;
  private columnWidth: Array<{ key: string; width: number }>;

  constructor() {
    this.workbook = new ExcelJs.Workbook();
    this.sheet = this.workbook.addWorksheet('Лист1');
  }

  title(title: string, mergedSells: string) {
    this.sheet.mergeCells(mergedSells);
    const titleCell = this.sheet.getCell('A1');
    titleCell.font = {
      name: 'Calibri',
      size: 16,
      bold: true,
    };
    titleCell.value = title;
    this.sheet.getRow(1).height = 30;
    this.sheet.getRow(1).alignment = {
      horizontal: 'center',
      vertical: 'middle',
    };
    return this;
  }

  columns(columns: Partial<ExcelJs.Column>[]) {
    this.sheet.columns = columns;
    this.columnWidth = columns.map(c => ({
      key: c.key || '',
      width: c?.width ? c.width * 0.7 : 7,
    }));
    return this;
  }

  header(values: string[], rowNumber: number, options?: { height?: number }) {
    const headerRow = this.sheet.getRow(rowNumber);
    headerRow.alignment = { wrapText: true, vertical: 'middle' };
    headerRow.values = values;
    headerRow.font = {
      name: 'Calibri',
      size: 12,
      bold: true,
    };
    options?.height && (headerRow.height = options.height);
    return this;
  }

  columnAlignment(alignment: ColumnAlignment) {
    Object.entries(alignment).forEach(([row, alignment]) => {
      this.sheet.getColumn(row).alignment = {
        ...alignment,
        wrapText: true,
        vertical: 'middle',
      };
    });
    this.sheet.getRow(1).alignment = {
      horizontal: 'center',
      vertical: 'middle',
    };
    return this;
  }

  intermediate({ row, alignment, value, mergeCells }: Intermediate) {
    const r = this.sheet.getRow(row);
    r.values = [value];
    r.alignment = alignment;
    if (mergeCells) {
      this.sheet.mergeCells(mergeCells);
    }
    return this;
  }

  cells(cells: Cell[]) {
    cells.forEach(({ index, value, alignment }) => {
      const cell = this.sheet.getCell(index);
      cell.value = value;
      if (alignment) {
        cell.alignment = alignment;
      } else {
        cell.alignment = {
          horizontal: 'left',
          wrapText: true,
          vertical: 'middle',
        };
      }
    });
    return this;
  }

  fill(data: any[], fromRow: number) {
    data.reverse().forEach(row => {
      this.sheet.insertRow(fromRow, row);
    });
    return this;
  }

  getColumnWidth() {
    return this.columnWidth;
  }

  getWorkbook() {
    return this.workbook;
  }

  getSheet() {
    return this.sheet;
  }

  async write(response: Response) {
    const buffer = await this.writeBuffer();
    return response.end(buffer);
  }

  async writeCsv(response: Response) {
    const buffer = await this.workbook.csv.writeBuffer();
    return response.end(buffer);
  }

  writeBuffer() {
    return this.workbook.xlsx.writeBuffer() as Promise<Buffer>;
  }
}

export type ColumnAlignment = {
  [key: string]: Partial<ExcelJs.Alignment>;
};

export type Intermediate = {
  row: number;
  mergeCells?: string;
  value?: ExcelJs.CellValue;
  alignment?: Partial<ExcelJs.Alignment>;
};

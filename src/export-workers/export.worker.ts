import { RequestQuery } from '@core/libs/types';
import { ExportStatusEnum, ExportTaskEntity } from '@modules/export-task/domain/export-task.entity';
import { createConnection } from 'typeorm';
import { databaseEntities } from '@core/config/database.config';
import { GetRowDataFn, ManualXlsxLibrary } from '@core/libs/manual-xlsx-library';
import { GetOdsRowFn, ManualOdsLibrary } from '@core/libs/manual-ods-library';
import { ExportFormat } from '@core/libs/excel-service.base';
import { getClientDateAndTime } from '@core/libs/getClientDateAndTime';
import { createReadStream, createWriteStream, existsSync, mkdirSync, unlinkSync, writeFileSync } from 'fs';
import { join } from 'path';
import { unzip } from '@core/libs/unzip';
import { zipFolderToStaticFiles } from '@core/libs/zip-folder-to-static-files';
import { copySync } from 'fs-extra';
import { zipToStaticFiles } from '@core/libs/zip-to-static-files';
import * as XLSX from 'xlsx';
import { ExportTaskProgressEvent } from '@modules/event/infrastructure/events/export-task-progress.event';
import { Content, ContentTable, Size } from 'pdfmake/interfaces';
import { generatePdfTable } from '@core/libs/generatePdfTable';

const staticPath = process.env.STATIC_PATH || '/opt/static_path'

export type ExportWorkerData<Dto = any> = {
  dto: RequestQuery & { userTimezone: number } & Dto
  exportTask: ExportTaskEntity
  format: ExportFormat
}

export const createWorkerConnection = (name?: string) => {
  return createConnection({
    name,
    type: 'postgres',
    host: process.env.PG_HOST || '172.29.30.64',
    port: Number(process.env.PG_PORT) || 5432,
    username: process.env.PG_USER || 'postgres',
    password: process.env.PG_PASSWORD || 'postgres',
    database: process.env.PG_DATABASE || 'sdo',
    entities: databaseEntities
  })
}

export type GetDataInLoopFn<Data> = (args: { pageSize: number, offset: number }) => Promise<[Data[]] | [Data[], number]>

export type GetXlsRowDataFn<Data> = (data: Data) => (string | number)[]
export type GetPdfRowDataFn<Data> = (data: Data) => (string | number)[]

export type ExportWorkerOptions<Data, Dto> = {
  getDataInLoop: GetDataInLoopFn<Data>,
  total: number,
  exportTask: ExportTaskEntity,
  dto: Dto,
  exportName: string,
  firstDataRow: number,
  pdfHeaderRow: string[],
  pdfFilters?: Content[],
  pdfColumnWidth?: '*' | 'auto' | Size[],
  onIteration?: (payload: ExportTaskProgressEvent) => void
}

export class ExportWorker<Data, Dto extends { userTimezone: number }> {
  private readonly getDataInLoop: GetDataInLoopFn<Data>
  private readonly total: number
  private readonly exportTask: ExportTaskEntity
  private folderNames: string[] = []
  private readonly totalXlsxOrOdsFiles: number
  private readonly totalXlsFiles: number
  private readonly totalPdfFiles: number
  private readonly maxXlsxOrOdsFileSize = 999900
  private readonly maxXlsFileSize = 65500
  private readonly maxPdfFileSize = 1000
  private readonly dto: Dto
  private readonly exportName: string
  private restSize: number
  private readonly onIteration?: (payload: ExportTaskProgressEvent) => void
  private readonly firstDataRow: number
  private readonly pdfHeaderRow: string[]
  private readonly pdfFilters?: Content[]
  private readonly pdfColumnWidth: '*' | 'auto' | Size[] | undefined

  static readonly exportXlsxChunkSize = 50000
  static readonly exportXlsChunkSize = 25000
  static readonly exportPdfChunkSize = 1000

  constructor(
    {
      exportName,
      exportTask,
      dto,
      onIteration,
      pdfFilters,
      firstDataRow,
      pdfColumnWidth,
      pdfHeaderRow,
      total,
      getDataInLoop
    }: ExportWorkerOptions<Data, Dto>
  ) {
    this.getDataInLoop = getDataInLoop
    this.total = total
    this.exportTask = exportTask
    this.folderNames = [exportTask.id]
    this.totalXlsxOrOdsFiles = Math.ceil(total / this.maxXlsxOrOdsFileSize)
    this.totalXlsFiles = Math.ceil(total / this.maxXlsFileSize)
    this.totalPdfFiles = Math.ceil(total / this.maxPdfFileSize)
    this.dto = dto
    this.exportName = exportName
    this.restSize = total
    this.onIteration = onIteration
    this.firstDataRow = firstDataRow
    this.pdfHeaderRow = pdfHeaderRow
    this.pdfFilters = pdfFilters
    this.pdfColumnWidth = pdfColumnWidth
  }

  async run(
    format: ExportFormat,
    getXlsxRow: GetRowDataFn<Data>,
    getOdsRow: GetOdsRowFn<Data>,
    getXlsRow: GetXlsRowDataFn<Data>,
    getPdfRow: GetPdfRowDataFn<Data>
  ) {
    let result: { fileName: string, href: string }
    switch (format) {
      case 'xlsx':
        await this.unzipXlsxOrOds()
        result = await this.workOnXlsx(getXlsxRow)
        break
      case 'ods':
        await this.unzipXlsxOrOds()
        result = await this.workOnOds(getOdsRow)
        break
      case 'xls':
        result = await this.workOnXls(getXlsRow)
        break
      case 'pdf':
        result = await this.workOnPdf(getPdfRow)
    }

    this.deleteTemporaryFiles()

    return result
  }

  completeExportTask(exportTask: ExportTaskEntity, result: { fileName: string, href: string }) {
    exportTask.fileName = result.fileName
    exportTask.href = result.href
    exportTask.status = ExportStatusEnum.COMPLETED
    exportTask.progress = 100
  }

  // Распаковка xlsx иди ods формата
  async unzipXlsxOrOds() {
    await unzip(join(staticPath, 'temp_' + this.exportTask.id), this.getExcelUnzipPath())
  }

  private async workOnXlsx(getRowData: GetRowDataFn<Data>) {
    if (this.totalXlsxOrOdsFiles === 1) {
      await this.iterateWithXlsx(getRowData)
      await this.zipXlsx()
      return {
        fileName: this.getFileName('xlsx'),
        href:  `${this.exportTask.id}.xlsx`
      }
    } else {
      // Если нужно больше 1 файла, сначала копируется содержимое первой распакованной папки
      this.propagateFolders()
      // Затем папки заполняются данными
      let writtenRows = 0
      for (let folderName of this.folderNames) {
        const difference = await this.iterateWithXlsx(
          getRowData,
          writtenRows,
        )
        writtenRows += difference
        // Затем пакуются в xlsx
        await zipFolderToStaticFiles(this.getExcelUnzipPath(folderName), folderName, 'xlsx')
      }
      // После все файлы сохраняются в один архив
      await this.zipManyFilesToArchive('xlsx')
      return {
        fileName: `${this.exportName}.zip`,
        href: `${this.exportTask.id}.zip`
      }
    }
  }

  private async workOnOds(getRowData: GetOdsRowFn<Data>) {
    if (this.totalXlsxOrOdsFiles === 1) {
      await this.iterateWithOds(getRowData)
      await this.zipOds()
      return {
        fileName: this.getFileName('ods'),
        href: `${this.exportTask.id}.ods`
      }
    } else {
      this.propagateFolders()
      let writtenRows = 0
      for (let folderName of this.folderNames) {
        const difference = await this.iterateWithOds(
          getRowData,
          writtenRows,
        )
        writtenRows += difference
        await zipFolderToStaticFiles(this.getExcelUnzipPath(folderName), folderName, 'ods')
      }
      await this.zipManyFilesToArchive('ods')
      return {
        fileName: `${this.exportName}.zip`,
        href: `${this.exportTask.id}.zip`
      }
    }
  }

  private async workOnXls(
    getDataRow: GetXlsRowDataFn<Data>
  ) {
    this.folderNames = ['temp_' + this.exportTask.id]
    if (this.totalXlsFiles === 1) {
      await this.iterateWithXls(getDataRow, 'temp_' + this.exportTask.id)
      return {
        fileName: this.getFileName('xls'),
        href: `temp_${this.exportTask.id}.xls`
      }
    } else {
      this.propagateXlsFiles()
      let writtenRows = 0
      for (let folderName of this.folderNames) {
        const difference = await this.iterateWithXls(
          getDataRow,
          folderName,
          writtenRows,
        )
        writtenRows += difference
      }
      await this.zipManyFilesToArchive('xls')
      return {
        fileName: `${this.exportName}.zip`,
        href: `${this.exportTask.id}.zip`
      }
    }
  }

  async workOnPdf(getDataRow: GetPdfRowDataFn<Data>) {
    if (this.totalPdfFiles === 1) {
      await this.iterateWithPdf(getDataRow, this.exportTask.id)
      return {
        fileName: this.getFileName('pdf'),
        href: `${this.exportTask.id}.pdf`
      }
    } else {
      this.propagatePdfFiles()
      let writtenRows = 0
      for (let folderName of this.folderNames) {
        const difference = await this.iterateWithPdf(
          getDataRow,
          folderName,
          writtenRows
        )
        writtenRows += difference
      }
      await this.zipManyFilesToArchive('pdf')
      return {
        fileName: `${this.exportName}.zip`,
        href: `${this.exportTask.id}.zip`
      }
    }
  }

  deleteTemporaryFiles() {
    if (existsSync(join(staticPath, 'temp_' + this.exportTask.id))) unlinkSync(join(staticPath, 'temp_' + this.exportTask.id))
    if (this.folderNames.length > 1) {
      for (let folderName of this.folderNames) {
        if (existsSync(join(staticPath, folderName))) unlinkSync(join(staticPath, folderName))
        if (existsSync(this.getExcelUnzipPath(folderName))) unlinkSync(this.getExcelUnzipPath(folderName))
      }
    }
  }

  private async zipXlsx() {
    await zipFolderToStaticFiles(this.getExcelUnzipPath(), this.exportTask.id, 'xlsx')
  }

  private async zipOds() {
    await zipFolderToStaticFiles(this.getExcelUnzipPath(), this.exportTask.id, 'ods')
  }

  private getExcelUnzipPath(exportTaskId?: string) {
    return join(process.cwd(), 'excel-unzip', exportTaskId || this.exportTask.id)
  }

  private async iterateWithXlsx(getRowData: GetRowDataFn<Data>, fromOffset?: number) {
    let offset = fromOffset || 0
    let pageSize = ExportWorker.exportXlsxChunkSize
    let writtenRows = 0
    const manualXlsxLibrary = new ManualXlsxLibrary(this.exportTask.id)
    await manualXlsxLibrary.prepareToEdit()

    while (this.restSize > 0) {
      const [data] = await this.getDataInLoop({ pageSize, offset })
      manualXlsxLibrary.appendData(data, getRowData)
      this.onIteration?.({ exportTaskId: this.exportTask.id, progress: this.calculateProgress() })
      this.restSize -= pageSize
      writtenRows += data.length
      offset += data.length
      if ((writtenRows + pageSize) > this.maxXlsxOrOdsFileSize) {
        pageSize = this.maxXlsxOrOdsFileSize - writtenRows;
        if (pageSize <= 0) break
      }
    }

    manualXlsxLibrary.end()
    return writtenRows
  }

  private async iterateWithOds(getRowData: GetOdsRowFn<Data>, fromOffset?: number) {
    let offset = fromOffset || 0
    let pageSize = ExportWorker.exportXlsxChunkSize
    let writtenRows = 0

    const manualOdsLibrary = new ManualOdsLibrary(this.exportTask.id)
    await manualOdsLibrary.prepareToEdit()

    while (this.restSize > 0) {
      const [data] = await this.getDataInLoop({ pageSize, offset })
      manualOdsLibrary.appendData(data, getRowData)
      this.onIteration?.({ exportTaskId: this.exportTask.id, progress: this.calculateProgress() })
      this.restSize -= pageSize
      writtenRows += data.length
      offset += data.length
      if ((writtenRows + pageSize) > this.maxXlsxOrOdsFileSize) {
        pageSize = this.maxXlsxOrOdsFileSize - writtenRows;
        if (pageSize <= 0) break
      }
    }

    manualOdsLibrary.end()
    return writtenRows
  }

  private async iterateWithXls(
    getDataRow: GetXlsRowDataFn<Data>,
    fileName: string,
    fromOffset?: number,
  ) {
    const workbook = XLSX.read(join(staticPath, fileName), { type: 'file' })
    const worksheet = workbook.Sheets['Лист1']
    let offset = fromOffset || 0
    let pageSize = ExportWorker.exportXlsChunkSize
    let writtenRows = 0
    while (this.restSize > 0) {
      const [data] = await this.getDataInLoop({ pageSize, offset })
      data.forEach((d, i) => {
        const row = getDataRow(d)
        XLSX.utils.sheet_add_aoa(worksheet, [[writtenRows + 1 + i, ...row]], { origin: `A${writtenRows + this.firstDataRow + i}` })
      })
      this.onIteration?.({ exportTaskId: this.exportTask.id, progress: this.calculateProgress() })
      writtenRows += data.length
      this.restSize -= pageSize
      offset += data.length
      if ((writtenRows + pageSize) > this.maxXlsFileSize) {
        pageSize = this.maxXlsFileSize - writtenRows;
        if (pageSize <= 0) break
      }
    }

    const xlsBuffer = await XLSX.write(workbook, { type: 'buffer', bookType: 'xls' })

    writeFileSync(join(staticPath, fileName + '.xls'), xlsBuffer, 'binary')

    return writtenRows
  }

  private async iterateWithPdf(
    getDataRow: GetPdfRowDataFn<Data>,
    fileName: string,
    fromOffset?: number
  ) {
    let offset = fromOffset || 0
    let pageSize = ExportWorker.exportPdfChunkSize
    let writtenRows = 0
    const contentTable: ContentTable = {
      table: {
        widths: this.pdfColumnWidth,
        body: [
          this.pdfHeaderRow
        ]
      }
    }

    while (this.restSize > 0) {
      const [data] = await this.getDataInLoop({ pageSize, offset })
      data.forEach((d, i) => {
        const row = getDataRow(d)
        contentTable.table.body.push([writtenRows + i + 1,...row])
      })
      this.onIteration?.({ exportTaskId: this.exportTask.id, progress: this.calculateProgress() })
      writtenRows += data.length
      this.restSize -= pageSize
      offset += data.length
      if ((writtenRows + pageSize) > this.maxPdfFileSize) {
        pageSize = this.maxPdfFileSize - writtenRows;
        if (pageSize <= 0) break
      }
    }

    const pdf = generatePdfTable({
      contentTable,
      total: this.total,
      title: this.exportName,
      filters: this.pdfFilters,
      generateDate: getClientDateAndTime(new Date(this.exportTask.createdAt), this.dto.userTimezone)
    })

    await pdf.pipe(createWriteStream(join(staticPath, fileName + '.pdf')))
    await pdf.end()

    return writtenRows
  }

  private propagateFolders() {
    for (let i = 1; i <= this.totalXlsxOrOdsFiles; i++) {
      mkdirSync(this.getExcelUnzipPath(this.exportTask.id + `_${i}`), { recursive: true })
      this.folderNames.push(this.exportTask.id + `_${i}`)
      copySync(this.getExcelUnzipPath(), this.getExcelUnzipPath(this.exportTask.id + `_${i}`))
    }
  }

  private propagateXlsFiles() {
    for (let i = 1; i < this.totalXlsFiles; i++) {
      this.folderNames.push(this.exportTask.id + `_${i}`)
      copySync(join(staticPath, 'temp_' + this.exportTask.id), join(staticPath, this.exportTask.id + `_${i}`))
    }
  }

  private propagatePdfFiles() {
    for (let i = 1; i < this.totalPdfFiles; i++) {
      this.folderNames.push(this.exportTask.id + `_${i}`)
    }
  }

  private async zipManyFilesToArchive(format?: ExportFormat) {
    await zipToStaticFiles(
      this.exportTask.id,
      ...this.folderNames.map((name, i) => {
        return ({
          fileName: this.getFileName(format, i + 1),
          source: createReadStream(join(staticPath, name + (format ? `.${format}` : '')))
        })
      })
    )
  }

  private getFileName(format: ExportFormat, indexNumber?: number) {
    return `${this.exportName}_${getClientDateAndTime(this.exportTask.createdAt, this.dto.userTimezone)}${indexNumber ? `_${indexNumber}` : ''}.${format}`
  }

  private calculateProgress() {
    return Math.round(((this.total - this.restSize) / this.total) * 100)
  }
}
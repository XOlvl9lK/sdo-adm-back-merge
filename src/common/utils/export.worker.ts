import { ExportJob } from '@modules/export-job/domain/export-job';
import { ExportFormat } from '@common/base/excel-service.base';
import { ElasticRepoBase } from '@common/base/elastic-repo.base';
import { ElasticService } from '@modules/elastic/services/elastic.service';
import { Client } from '@elastic/elasticsearch';
import { GetXlsxRowFn, ManualXlsxLibrary } from '@common/utils/manual-xlsx-library';
import { GetOdsRowFn, ManualOdsLibrary } from '@common/utils/manual-ods-library';
import { join } from 'path';
import { unzip } from '@common/utils/unzip';
import { createReadStream, createWriteStream, existsSync, mkdirSync, unlinkSync, writeFileSync } from 'fs';
import { copySync } from 'fs-extra';
import { COMPRESSION_LEVEL, zip } from 'zip-a-folder';
import { ZipFile } from 'yazl';
import * as XLSX from 'xlsx';
import { createConnection } from 'typeorm';
import { ormEntities } from '@config/ormconfig';
import { MinioService } from '@modules/minio/services/minio.service';
import { ConfigService } from '@nestjs/config';

const tempPath = join(process.cwd(), 'temp');

export const getElasticRepo = <Entity, Repo extends ElasticRepoBase<Entity>>(
  Constructor: new (elasticService: ElasticService) => Repo,
) => {
  const host = process.env.ELASTICSEARCH_HOST;
  const port = process.env.ELASTICSEARCH_PORT;
  const username = process.env.ELASTICSEARCH_USERNAME;
  const password = process.env.ELASTICSEARCH_PASSWORD;

  const client = new Client({
    node: `${host}:${port}`,
    auth: { username, password },
  });

  return new Constructor({ client });
};

export const createWorkerConnection = () => {
  return createConnection({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: ormEntities,
  });
};

export type ExportWorkerArgs<Dto = any> = {
  dto: Dto;
  exportJob: ExportJob;
  format: ExportFormat;
};

export type GetDataInLoopFn<Data> = (args: {
  pageSize: number;
  page: number;
}) => Promise<{ data: Data[]; total: number }>;

type ExportWorkerOptions<Data, Dto> = {
  getDataInLoop: GetDataInLoopFn<Data>;
  total: number;
  exportJob: ExportJob;
  dto: Dto;
  exportName: string;
  firstDataRow: number;
  columnKeys: string[];
};

export class ExportWorker<Data, Dto> {
  private readonly getDataInLoop: GetDataInLoopFn<Data>;
  private readonly total: number;
  private readonly exportJob: ExportJob;
  private readonly maxXlsxOrOdsFileSize = 999900;
  private readonly maxXlsFileSize = 65500;
  private readonly totalXlsxOrOdsFiles: number;
  private readonly totalXlsFiles: number;
  private readonly dto: Dto;
  private readonly exportName: string;
  private restSize: number;
  private readonly firstDataRow: number;
  private folderOrFileNames: string[] = [];
  private readonly columnKeys: string[] = [];

  private remainingData = [];

  private readonly maxExportXlsxChunkSize = 50000;
  private readonly maxExportXlsChunkSize = 25000;

  private readonly exportXlsxChunkSize;
  private readonly exportXlsChunkSize;

  private readonly minioService: MinioService;

  constructor({
    firstDataRow,
    exportName,
    exportJob,
    getDataInLoop,
    dto,
    total,
    columnKeys,
  }: ExportWorkerOptions<Data, Dto>) {
    this.getDataInLoop = getDataInLoop;
    this.total = total;
    this.totalXlsxOrOdsFiles = Math.ceil(total / this.maxXlsxOrOdsFileSize);
    this.totalXlsFiles = Math.ceil(total / this.maxXlsFileSize);
    this.dto = dto;
    this.exportName = exportName;
    this.restSize = total;
    this.firstDataRow = firstDataRow;
    this.exportJob = exportJob;
    this.folderOrFileNames = [exportJob.id];
    this.columnKeys = columnKeys;
    this.exportXlsxChunkSize = total < this.maxExportXlsxChunkSize ? total : this.maxExportXlsxChunkSize;
    this.exportXlsChunkSize = total < this.maxExportXlsChunkSize ? total : this.maxExportXlsChunkSize;
    this.minioService = new MinioService(new ConfigService());
  }

  async run(format: ExportFormat, getDataRow: GetXlsxRowFn<Data>) {
    switch (format) {
      case 'xlsx':
        await this.unzipXlsxOrOds();
        await this.workOnXlsx(getDataRow);
        break;
      case 'ods':
        await this.unzipXlsxOrOds();
        await this.workOnOds(getDataRow);
        break;
      case 'xls':
        await this.workOnXls(getDataRow);
        break;
    }

    const fileName =
      this.folderOrFileNames.length > 1
        ? `${this.exportName}_${this.exportJob.id}.zip`
        : `${this.exportName}_${this.exportJob.id}.${format}`;

    await this.minioService.uploadFile(`exports/${fileName}`, join(tempPath, fileName), {
      'Content-Type':
        format === 'xls'
          ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          : 'application/vnd.ms-excel',
    });
    this.deleteTemporaryFiles(fileName);

    return fileName;
  }

  async unzipXlsxOrOds() {
    await unzip(join(tempPath, 'temp_' + this.exportJob.id), this.getExcelUnzipPath());
  }

  private getExcelUnzipPath(exportTaskId?: string) {
    return join(process.cwd(), 'excel-unzip', exportTaskId || this.exportJob.id);
  }

  private async workOnXlsx(getXlsxRow: GetXlsxRowFn<Data>) {
    if (this.totalXlsxOrOdsFiles === 1) {
      await this.iterateWithXlsx(getXlsxRow);
      await this.zipXlsx();
    } else {
      this.propagateFolders();
      let page = 1;
      for (const folderName of this.folderOrFileNames) {
        const difference = await this.iterateWithXlsx(getXlsxRow, page);
        page += difference;
        await this.zipFolderToStaticFiles(this.getExcelUnzipPath(folderName), folderName, 'xlsx');
      }
      await this.zipManyFilesToArchive('xlsx');
    }
  }

  private async workOnOds(getOdsRow: GetOdsRowFn<Data>) {
    if (this.totalXlsxOrOdsFiles === 1) {
      await this.iterateWithOds(getOdsRow);
      await this.zipOds();
    } else {
      this.propagateFolders();
      let page = 1;
      for (const folderName of this.folderOrFileNames) {
        const difference = await this.iterateWithOds(getOdsRow, page);
        page += difference;
        await this.zipFolderToStaticFiles(this.getExcelUnzipPath(folderName), folderName, 'ods');
      }
      await this.zipManyFilesToArchive('ods');
    }
  }

  private async workOnXls(getXlsRow: GetOdsRowFn<Data>) {
    this.folderOrFileNames = ['temp_' + this.exportJob.id];
    if (this.totalXlsFiles === 1) {
      await this.iterateWithXls(getXlsRow, 'temp_' + this.exportJob.id);
    } else {
      this.propagateXlsFiles();
      let page = 1;
      for (const folderName of this.folderOrFileNames) {
        const difference = await this.iterateWithXls(getXlsRow, folderName, page);
        page += difference;
      }
      await this.zipManyFilesToArchive('xls');
    }
  }

  private propagateFolders() {
    for (let i = 1; i <= this.totalXlsxOrOdsFiles; i++) {
      mkdirSync(this.getExcelUnzipPath(this.exportJob.id + `_${i}`), { recursive: true });
      this.folderOrFileNames.push(this.exportJob.id + `_${i}`);
      copySync(this.getExcelUnzipPath(), this.getExcelUnzipPath(this.exportJob.id + `_${i}`));
    }
  }

  private async iterateWithXlsx(getXlsxRow: GetXlsxRowFn<Data>, fromPage?: number) {
    let page = fromPage || 1;
    let pageSize = this.exportXlsxChunkSize;
    let writtenRows = 0;
    const manualXlsxLibrary = new ManualXlsxLibrary(this.exportJob.id, this.columnKeys);
    await manualXlsxLibrary.prepareToEdit();

    const write = (data: Data[]) => {
      manualXlsxLibrary.appendData(data, getXlsxRow);
      this.restSize -= data.length;
      writtenRows += data.length;
    };

    if (this.remainingData.length) {
      write(this.remainingData);
      this.remainingData = [];
    }

    while (this.restSize > 0) {
      if (this.restSize < pageSize) pageSize = this.restSize;
      const { data } = await this.getDataInLoop({ pageSize, page });
      page++;
      if (writtenRows + data.length > this.maxXlsxOrOdsFileSize) {
        const dataToAppend = data.slice(0, this.maxXlsxOrOdsFileSize - writtenRows);
        write(dataToAppend);
        this.remainingData = data.slice(this.maxXlsxOrOdsFileSize - writtenRows, data.length);
        break;
      }
      write(data);
    }

    manualXlsxLibrary.end();
    return page;
  }

  private async iterateWithOds(getOdsRow: GetOdsRowFn<Data>, fromPage?: number) {
    let page = fromPage || 1;
    let pageSize = this.exportXlsxChunkSize;
    let writtenRows = 0;

    const manualOdsLibrary = new ManualOdsLibrary(this.exportJob.id, this.columnKeys);
    await manualOdsLibrary.prepareToEdit();

    const write = (data: Data[]) => {
      manualOdsLibrary.appendData(data, getOdsRow);
      this.restSize -= data.length;
      writtenRows += data.length;
    };

    if (this.remainingData.length) {
      write(this.remainingData);
      this.remainingData = [];
    }

    while (this.restSize > 0) {
      if (this.restSize < pageSize) pageSize = this.restSize;
      const { data } = await this.getDataInLoop({ pageSize, page });
      page++;
      if (writtenRows + data.length > this.maxXlsxOrOdsFileSize) {
        const dataToAppend = data.slice(0, this.maxXlsxOrOdsFileSize - writtenRows);
        write(dataToAppend);
        this.remainingData = data.slice(this.maxXlsxOrOdsFileSize - writtenRows, data.length);
        break;
      }
      write(data);
    }

    manualOdsLibrary.end();
    return page;
  }

  private async iterateWithXls(getXlsRow: GetOdsRowFn<Data>, fileName: string, fromPage?: number) {
    const workbook = XLSX.read(join(tempPath, fileName), { type: 'file' });
    const worksheet = workbook.Sheets['Лист1'];
    let page = fromPage || 1;
    let pageSize = this.exportXlsChunkSize;
    let writtenRows = 0;

    const write = (data: Data[]) => {
      data.forEach((d, i) => {
        let row = Object.values(getXlsRow(d));
        if (this.columnKeys.length) {
          row = this.columnKeys.map((key) => data[key]).filter(Boolean);
        }
        XLSX.utils.sheet_add_aoa(worksheet, [[writtenRows + 1 + i, ...row]], {
          origin: `A${writtenRows + this.firstDataRow + i}`,
        });
      });
      this.restSize -= data.length;
      writtenRows += data.length;
    };

    if (this.remainingData.length) {
      write(this.remainingData);
      this.remainingData = [];
    }

    while (this.restSize > 0) {
      if (this.restSize < pageSize) pageSize = this.restSize;
      const { data } = await this.getDataInLoop({ pageSize, page });
      page++;
      if (writtenRows + data.length > this.maxXlsFileSize) {
        const dataToAppend = data.slice(0, this.maxXlsFileSize - writtenRows);
        write(dataToAppend);
        this.remainingData = data.slice(this.maxXlsFileSize - writtenRows, data.length);
        break;
      }
      write(data);
    }

    const xlsBuffer = await XLSX.write(workbook, { type: 'buffer', bookType: 'xls' });

    writeFileSync(join(tempPath, fileName + '.xls'), xlsBuffer, 'binary');

    return page;
  }

  private async zipXlsx() {
    await this.zipFolderToStaticFiles(this.getExcelUnzipPath(), `${this.exportName}_${this.exportJob.id}`, 'xlsx');
  }

  private async zipOds() {
    await this.zipFolderToStaticFiles(this.getExcelUnzipPath(), `${this.exportName}_${this.exportJob.id}`, 'ods');
  }

  private async zipFolderToStaticFiles(folderPath: string, fileName: string, format?: string) {
    const writeStream = createWriteStream(join(tempPath, `${fileName}${format ? `.${format}` : ''}`));
    await zip(folderPath, undefined, { customWriteStream: writeStream, compression: COMPRESSION_LEVEL.uncompressed });
  }

  private async zipManyFilesToArchive(format?: ExportFormat) {
    const writeStream = createWriteStream(join(tempPath, `${this.exportName}_${this.exportJob.id}.zip`));
    const zipFile = new ZipFile();
    this.folderOrFileNames.forEach((name, i) => {
      zipFile.addReadStream(
        createReadStream(join(tempPath, name + (format ? `.${format}` : ''))),
        this.exportName + `_${i + 1}.${format}`,
      );
    });
    zipFile.end();
    zipFile.outputStream.pipe(writeStream);
  }

  private propagateXlsFiles() {
    for (let i = 1; i < this.totalXlsFiles; i++) {
      this.folderOrFileNames.push(this.exportJob.id + `_${i}`);
      copySync(join(tempPath, 'temp_' + this.exportJob.id), join(tempPath, this.exportJob.id + `_${i}`));
    }
  }

  private deleteTemporaryFiles(fileName: string) {
    if (existsSync(join(tempPath, 'temp_' + this.exportJob.id))) {
      unlinkSync(join(tempPath, 'temp_' + this.exportJob.id));
    }
    if (this.folderOrFileNames.length > 1) {
      for (const folderName of this.folderOrFileNames) {
        if (existsSync(join(tempPath, folderName))) unlinkSync(join(tempPath, folderName));
        if (existsSync(this.getExcelUnzipPath(folderName))) unlinkSync(this.getExcelUnzipPath(folderName));
      }
    }
    if (existsSync(join(tempPath, fileName))) unlinkSync(join(tempPath, fileName));
  }
}

import { Controller, Get, Param, Post, UploadedFile, UseInterceptors, Response, Delete, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express, Response as ExpressResponse } from 'express';
import { UploadFileService } from '@src/modules/file/application/upload-file.service';
import { DownloadFileService } from '@src/modules/file/application/download-file.service';
import { FileEntity } from 'src/modules/file/domain/file.entity';
import { DeleteFileService } from 'src/modules/file/application/delete-file.service';
import { FileSystemService } from 'src/modules/file/infrastructure/file-system.service';
import { join } from 'path';

@Controller('files')
export class FileController {
  constructor(
    private uploadFileService: UploadFileService,
    private downloadFileService: DownloadFileService,
    private deleteFileService: DeleteFileService,
    private fileSystemService: FileSystemService,
  ) {}

  @Get('import-users-template')
  async getImportUsersTemplate(@Res() res: ExpressResponse) {
    const buffer = await this.fileSystemService.readAsBuffer(
      join(process.cwd(), 'static', 'import-users-template.xls'),
    );
    const filename = encodeURIComponent(`Шаблон импорта пользователей.xls`);
    res.setHeader('Content-Disposition', `filename=${filename}`);
    res.setHeader('Content-Type', 'application/vnd.ms-excel');
    res.send(buffer);
    res.end();
  }

  @Get(':id')
  async downloadFile(@Param('id') id: string, @Response() res: ExpressResponse) {
    const { file, fileStream } = await this.downloadFileService.download(id);
    const filename = encodeURIComponent(`${file.fileName}.${file.extension}`);
    res.setHeader('Content-Disposition', `filename=` + filename);
    res.setHeader('Content-Type', file.mimetype);
    fileStream.pipe(res);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return await this.uploadFileService.upload(file);
  }

  @Delete(':id')
  async deleteFile(@Param('id') id: string): Promise<FileEntity> {
    return await this.deleteFileService.delete(id);
  }
}

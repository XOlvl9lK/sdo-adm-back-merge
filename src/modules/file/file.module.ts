import { Module } from '@nestjs/common';
import { FileController } from '@src/modules/file/controllers/file.controller';
import { UploadFileService } from '@src/modules/file/application/upload-file.service';
import { DownloadFileService } from '@src/modules/file/application/download-file.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileRepository } from '@src/modules/file/infrastructure/database/file.repository';
import { DeleteFileService } from '@src/modules/file/application/delete-file.service';
import { FileSystemService } from '@src/modules/file/infrastructure/file-system.service';
import { MinioService } from 'src/modules/file/infrastructure/minio.service';
import { PdfService } from 'src/modules/file/infrastructure/pdf.service';
import { ZipService } from 'src/modules/file/infrastructure/zip.service';
import { FileService } from 'src/modules/file/infrastructure/file.service';
import { ExcelService } from '@modules/file/infrastructure/excel.service';
import { DownloadFileEventHandler } from '@modules/file/application/download-file.event-handler';

@Module({
  controllers: [FileController],
  providers: [
    UploadFileService,
    DownloadFileService,
    DeleteFileService,
    FileSystemService,
    FileService,
    MinioService,
    PdfService,
    ZipService,
    ExcelService,
    DownloadFileEventHandler,
  ],
  imports: [TypeOrmModule.forFeature([FileRepository])],
  exports: [
    UploadFileService,
    DownloadFileService,
    DeleteFileService,
    FileService,
    FileSystemService,
    MinioService,
    PdfService,
    ZipService,
    ExcelService,
  ],
})
export class FileModule {}

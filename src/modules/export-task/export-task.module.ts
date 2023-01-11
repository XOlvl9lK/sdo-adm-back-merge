import { Module } from '@nestjs/common';
import { CreateExportTaskService } from '@modules/export-task/application/create-export-task.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExportTaskRepository } from '@modules/export-task/infrastructure/export-task.repository';
import { UserRepository } from '@modules/user/infrastructure/database/user.repository';
import { UpdateExportTaskService } from '@modules/export-task/application/update-export-task.service';
import { FindExportTaskService } from '@modules/export-task/application/find-export-task.service';
import { FileRepository } from '@modules/file/infrastructure/database/file.repository';
import { ExportTaskController } from '@modules/export-task/controllers/export-task.controller';
import { DownloadExportTaskService } from '@modules/export-task/application/download-export-task.service';
import { FileModule } from '@modules/file/file.module';

@Module({
  controllers: [ExportTaskController],
  providers: [CreateExportTaskService, UpdateExportTaskService, FindExportTaskService, DownloadExportTaskService],
  imports: [
    TypeOrmModule.forFeature([
      ExportTaskRepository,
      UserRepository,
      FileRepository
    ]),
    FileModule
  ],
  exports: [CreateExportTaskService, UpdateExportTaskService]
})
export class ExportTaskModule {}

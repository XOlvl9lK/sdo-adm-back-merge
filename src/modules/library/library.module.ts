import { Module } from '@nestjs/common';
import { LibraryController } from '@modules/library/controllers/library.controller';
import { CreateLibraryFileService } from '@modules/library/application/create-library-file.service';
import { FindLibraryFileService } from '@modules/library/application/find-library-file.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LibraryFileRepository } from '@modules/library/infrastructure/database/library-file.repository';
import { UserRepository } from '@modules/user/infrastructure/database/user.repository';
import { FileRepository } from '@src/modules/file/infrastructure/database/file.repository';
import { ChapterRepository } from '@modules/chapter/infrastructure/database/chapter.repository';
import { DeleteLibraryFileService } from '@modules/library/application/delete-library-file.service';
import { UpdateLibraryFileService } from '@modules/library/application/update-library-file.service';
import { FileModule } from 'src/modules/file/file.module';
import { CheckInstallerUpdatesService } from '@modules/library/application/check-installer-updates.service';
import { ChapterModule } from '@modules/chapter/chapter.module';

@Module({
  controllers: [LibraryController],
  imports: [
    TypeOrmModule.forFeature([LibraryFileRepository, UserRepository, FileRepository, ChapterRepository]),
    FileModule,
    ChapterModule
  ],
  providers: [
    CreateLibraryFileService,
    FindLibraryFileService,
    DeleteLibraryFileService,
    UpdateLibraryFileService,
    CheckInstallerUpdatesService,
  ],
})
export class LibraryModule {}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LibraryFileRepository } from '@modules/library/infrastructure/database/library-file.repository';
import { UserRepository } from '@modules/user/infrastructure/database/user.repository';
import { FileRepository } from '@src/modules/file/infrastructure/database/file.repository';
import { CreateLibraryFileRequestDto } from '@modules/library/controllers/dtos/create-library-file.request-dto';
import { UserException } from '@modules/user/infrastructure/exceptions/user.exception';
import { FileException } from '@src/modules/file/infrastructure/exceptions/file.exception';
import { LibraryFileEntity } from '@modules/library/domain/library-file.entity';
import { ChapterRepository } from '@modules/chapter/infrastructure/database/chapter.repository';
import { ChapterException } from '@modules/chapter/infrastructure/exceptions/chapter.exception';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventActionEnum } from '@modules/event/application/create-event.service';
import { AddLibraryFileEvent } from '@modules/event/infrastructure/events/add-library-file.event';
import { BaseException } from '@core/exceptions/base.exception';
import { UploadFileService } from '@modules/file/application/upload-file.service';
import { CreateChapterService } from '@modules/chapter/application/create-chapter.service';
import { ChapterEntity } from '@modules/chapter/domain/chapter.entity';
import { ChapterModeEnum } from '@modules/course/controllers/dtos/create-course.dto';

@Injectable()
export class CreateLibraryFileService {
  constructor(
    @InjectRepository(LibraryFileRepository)
    private libraryFileRepository: LibraryFileRepository,
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    @InjectRepository(FileRepository)
    private fileRepository: FileRepository,
    @InjectRepository(ChapterRepository)
    private chapterRepository: ChapterRepository,
    private eventEmitter: EventEmitter2,
    private uploadFileService: UploadFileService,
    private createChapterService: CreateChapterService,
  ) {}

  async create({ title, authorId, chapterId, description, chapterCreateTitle, sectionMode }: CreateLibraryFileRequestDto, file: Express.Multer.File, userId: string) {
    let chapter: ChapterEntity;
    if (sectionMode === ChapterModeEnum.CREATE && chapterCreateTitle) {
      chapter = await this.createChapterService.create({ title: chapterCreateTitle }, userId);
    } else {
      chapter = await this.chapterRepository.findById(chapterId);
    }
    const author = await this.userRepository.findById(authorId)
    if (!author) UserException.NotFound('Библиотека');
    if (!chapter) ChapterException.NotFound();
    const fileEntity = await this.uploadFileService.upload(file)
    const libraryFile = new LibraryFileEntity(title, author, fileEntity, chapter, description);
    this.eventEmitter.emit(EventActionEnum.ADD_LIBRARY_FILE, new AddLibraryFileEvent(userId, libraryFile.id));
    return await this.libraryFileRepository.save(libraryFile);
  }

  async createInstaller(
    {
      title,
      authorId,
      chapterId,
      description,
      type,
      version,
      metadataDate,
      changes,
      chapterCreateTitle,
      sectionMode,
      versionDate,
    }: CreateLibraryFileRequestDto,
    file: Express.Multer.File,
    userId: string,
  ) {
    let chapter: ChapterEntity;
    if (sectionMode === ChapterModeEnum.CREATE && chapterCreateTitle) {
      chapter = await this.createChapterService.create({ title: chapterCreateTitle }, userId);
    } else {
      chapter = await this.chapterRepository.findById(chapterId);
    }
    const author = await this.userRepository.findById(authorId)
    const existedFile = await this.libraryFileRepository.findByVersionAndType(version, type);
    if (existedFile) {
      await this.libraryFileRepository.remove(existedFile);
    }
    const fileEntity = await this.uploadFileService.upload(file)
    const installerFile = new LibraryFileEntity(
      title,
      author,
      fileEntity,
      chapter,
      description,
      type,
      version,
      metadataDate,
      changes,
      versionDate,
    );
    this.eventEmitter.emit(EventActionEnum.ADD_INSTALLER, new AddLibraryFileEvent(userId, installerFile.id));
    return await this.libraryFileRepository.save(installerFile);
  }
}

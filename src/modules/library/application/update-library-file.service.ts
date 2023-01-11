import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LibraryFileRepository } from '@modules/library/infrastructure/database/library-file.repository';
import { UpdateLibraryFileRequestDto } from '@modules/library/controllers/dtos/update-library-file.request-dto';
import { ChapterRepository } from '@modules/chapter/infrastructure/database/chapter.repository';
import { ChapterException } from '@modules/chapter/infrastructure/exceptions/chapter.exception';
import { LibraryFileException } from '@modules/library/infrastructure/exceptions/library-file.exception';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventActionEnum } from '@modules/event/application/create-event.service';
import { UpdateEntityEvent } from '@modules/event/infrastructure/events/update-entity.event';
import { CreateChapterService } from '@modules/chapter/application/create-chapter.service';
import { ChapterEntity } from '@modules/chapter/domain/chapter.entity';
import { ChapterModeEnum } from '@modules/course/controllers/dtos/create-course.dto';

@Injectable()
export class UpdateLibraryFileService {
  constructor(
    @InjectRepository(LibraryFileRepository)
    private libraryFileRepository: LibraryFileRepository,
    @InjectRepository(ChapterRepository)
    private chapterRepository: ChapterRepository,
    private eventEmitter: EventEmitter2,
    private createChapterService: CreateChapterService,
  ) {}

  async update({ libraryFileId, title, description, chapterId, chapterCreateTitle, sectionMode }: UpdateLibraryFileRequestDto, userId: string) {
    const libraryFile = await this.libraryFileRepository.findById(libraryFileId)
    let chapter: ChapterEntity;
    if (sectionMode === ChapterModeEnum.CREATE && chapterCreateTitle) {
      chapter = await this.createChapterService.create({ title: chapterCreateTitle }, userId);
    } else {
      chapter = await this.chapterRepository.findById(chapterId);
    }
    if (!libraryFile) LibraryFileException.NotFound();
    if (!chapter) ChapterException.NotFound();
    libraryFile.update(title, chapter, description);
    this.eventEmitter.emit(
      EventActionEnum.UPDATE_ENTITY,
      new UpdateEntityEvent('файл библиотеки', userId, 'Библиотека', libraryFile),
    );
    return this.libraryFileRepository.save(libraryFile);
  }
}

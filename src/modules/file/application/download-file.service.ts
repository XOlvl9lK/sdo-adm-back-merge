import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileRepository } from '@src/modules/file/infrastructure/database/file.repository';
import { FileException } from '@src/modules/file/infrastructure/exceptions/file.exception';
import { FileService } from 'src/modules/file/infrastructure/file.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventActionEnum } from '@modules/event/application/create-event.service';
import { DownloadFileEvent } from '@modules/event/infrastructure/events/download-file.event';

@Injectable()
export class DownloadFileService {
  constructor(
    @InjectRepository(FileRepository)
    private fileRepository: FileRepository,
    private fileService: FileService,
    protected eventEmitter: EventEmitter2,
  ) {}

  async download(id: string) {
    const file = await this.fileRepository.findById(id);
    if (!file) FileException.NotFound();
    const fileStream = await this.fileService.get(file.id);
    this.eventEmitter.emit(EventActionEnum.DOWNLOAD_FILE, new DownloadFileEvent(file.id));
    return {
      file,
      fileStream,
    };
  }
}

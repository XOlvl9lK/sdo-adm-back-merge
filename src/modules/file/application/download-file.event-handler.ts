import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileRepository } from '@modules/file/infrastructure/database/file.repository';
import { OnEvent } from '@nestjs/event-emitter';
import { EventActionEnum } from '@modules/event/application/create-event.service';
import { DownloadFileEvent } from '@modules/event/infrastructure/events/download-file.event';

@Injectable()
export class DownloadFileEventHandler {
  constructor(
    @InjectRepository(FileRepository)
    private fileRepository: FileRepository,
  ) {}

  @OnEvent(EventActionEnum.DOWNLOAD_FILE, { async: true })
  async handleDownloadFile({ fileId }: DownloadFileEvent) {
    const file = await this.fileRepository.findById(fileId);
    if (file) {
      file.downloads++;
      await this.fileRepository.save(file);
    }
  }
}

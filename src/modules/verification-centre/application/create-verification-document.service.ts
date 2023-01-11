import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VerificationDocumentRepository } from '@modules/verification-centre/infrastructure/database/verification-document.repository';
import { CreateVerificationDocumentRequestDto } from '@modules/verification-centre/controllers/dtos/create-verification-document.request-dto';
import { FileRepository } from '@src/modules/file/infrastructure/database/file.repository';
import { FileException } from '@src/modules/file/infrastructure/exceptions/file.exception';
import {
  VerificationDocumentEntity,
  VerificationDocumentTypeEnum,
} from '@modules/verification-centre/domain/verification-document.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventActionEnum } from '@modules/event/application/create-event.service';
import { AddLibraryFileEvent } from '@modules/event/infrastructure/events/add-library-file.event';
import { UploadFileService } from '@modules/file/application/upload-file.service';

@Injectable()
export class CreateVerificationDocumentService {
  constructor(
    @InjectRepository(VerificationDocumentRepository)
    private verificationDocumentRepository: VerificationDocumentRepository,
    @InjectRepository(FileRepository)
    private fileRepository: FileRepository,
    private eventEmitter: EventEmitter2,
    private uploadFileService: UploadFileService,
  ) {}

  async create(
    file: Express.Multer.File,
    documentType: VerificationDocumentTypeEnum,
    userId: string,
  ) {
    const fileEntity = await this.uploadFileService.upload(file)
    const verificationDocument = new VerificationDocumentEntity(fileEntity.fileName, fileEntity, documentType);
    this.eventEmitter.emit(
      EventActionEnum.ADD_VERIFICATION_DOCUMENT,
      new AddLibraryFileEvent(userId, verificationDocument.id),
    );
    return await this.verificationDocumentRepository.save(verificationDocument);
  }
}

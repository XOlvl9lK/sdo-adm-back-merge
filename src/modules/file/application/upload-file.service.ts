import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileRepository } from '@src/modules/file/infrastructure/database/file.repository';
import { FileEntity } from '@src/modules/file/domain/file.entity';
import { FileService } from 'src/modules/file/infrastructure/file.service';
import { createHash } from 'crypto';

@Injectable()
export class UploadFileService {
  constructor(
    @InjectRepository(FileRepository)
    private fileRepository: FileRepository,
    private fileService: FileService,
  ) {}

  async upload(file: Express.Multer.File) {
    const dividedFilename = file.originalname.split('.');
    const extension = dividedFilename.pop();
    const originalName = dividedFilename.join('.');
    const hash = createHash('sha1').update(file.buffer).digest('base64');
    const uploadedFile = new FileEntity(originalName, extension, file.mimetype, file.size, hash);
    await this.fileService.save(uploadedFile.id, file.buffer);
    return await this.fileRepository.save(uploadedFile);
  }
}

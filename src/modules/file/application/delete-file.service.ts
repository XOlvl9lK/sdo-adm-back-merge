import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileRepository } from '@src/modules/file/infrastructure/database/file.repository';
import { FileException } from '@src/modules/file/infrastructure/exceptions/file.exception';
import { FileService } from 'src/modules/file/infrastructure/file.service';

@Injectable()
export class DeleteFileService {
  constructor(
    @InjectRepository(FileRepository)
    private fileRepository: FileRepository,
    private fileService: FileService,
  ) {}

  async delete(id: string) {
    const file = await this.fileRepository.findById(id);
    if (!file) FileException.NotFound();
    await this.fileService.delete(file.id);
    return this.fileRepository.remove(file);
  }
}

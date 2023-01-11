import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LibraryFileRepository } from '@modules/library/infrastructure/database/library-file.repository';
import { DeleteFileService } from '@src/modules/file/application/delete-file.service';
import { DeleteLibraryFileRequestDto } from '@modules/library/controllers/dtos/delete-library-file.request-dto';

@Injectable()
export class DeleteLibraryFileService {
  constructor(
    @InjectRepository(LibraryFileRepository)
    private libraryFileRepository: LibraryFileRepository,
    private deleteFileService: DeleteFileService,
  ) {}

  async deleteMany({ libraryFileIds }: DeleteLibraryFileRequestDto) {
    return await Promise.all(
      libraryFileIds.map(id =>
        this.libraryFileRepository
          .findById(id)
          .then(libraryFile => this.libraryFileRepository.remove(libraryFile))
          .then(libraryFile => this.deleteFileService.delete(libraryFile.file.id)),
      ),
    );
  }
}

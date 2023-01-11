import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LibraryFileRepository } from '@modules/library/infrastructure/database/library-file.repository';
import { InstallersEnum } from '@modules/library/domain/library-file.entity';
import { RequestQuery } from '@core/libs/types';

@Injectable()
export class FindLibraryFileService {
  constructor(
    @InjectRepository(LibraryFileRepository)
    private libraryFileRepository: LibraryFileRepository,
  ) {}

  async findAll(requestQuery: RequestQuery) {
    return await this.libraryFileRepository.findAll(requestQuery);
  }

  async findById(id: string) {
    return await this.libraryFileRepository.findById(id);
  }

  async findInstallersWin() {
    const [installerWin86, installerWin64] = await Promise.all([
      this.libraryFileRepository.findInstallersByType(InstallersEnum.WIN_86),
      this.libraryFileRepository.findInstallersByType(InstallersEnum.WIN_64),
    ]);
    return {
      installerWin86,
      installerWin64,
    };
  }

  async findInstallerLin() {
    return await this.libraryFileRepository.findInstallersByType(InstallersEnum.LIN);
  }

  async findInstallersMeta() {
    const [installerMetaWin, installerMetaLin] = await Promise.all([
      this.libraryFileRepository.findInstallersByType(InstallersEnum.META_WIN),
      this.libraryFileRepository.findInstallersByType(InstallersEnum.META_LIN),
    ]);
    return {
      installerMetaWin,
      installerMetaLin,
    };
  }
}

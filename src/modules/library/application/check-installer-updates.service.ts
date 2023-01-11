import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LibraryFileRepository } from '@modules/library/infrastructure/database/library-file.repository';
import { format, parse } from 'date-fns';
import { InstallersEnum } from '@modules/library/domain/library-file.entity';
import { LibraryFileException } from '@modules/library/infrastructure/exceptions/library-file.exception';
import { DownloadFileService } from '@modules/file/application/download-file.service';
import { LoggerService } from '@core/logger/logger.service';

export const osToInstallersTypeMap = {
  64: InstallersEnum.WIN_64,
  86: InstallersEnum.WIN_86,
  386: InstallersEnum.LIN,
};

export const osToMetaTypeMap = {
  13: InstallersEnum.META_WIN,
  313: InstallersEnum.META_LIN,
};

export type osInstallerType = keyof typeof osToInstallersTypeMap;
export type osMetaType = keyof typeof osToMetaTypeMap;

@Injectable()
export class CheckInstallerUpdatesService {
  constructor(
    @InjectRepository(LibraryFileRepository)
    private libraryFileRepository: LibraryFileRepository,
    private downloadFileService: DownloadFileService,
  ) {}

  async checkUpdates(armVersion: string, metadataDate: string) {
    const parsedMetadataDate = parse(metadataDate, 'dd.MM.yyyy', new Date());
    const [actualInstaller, actualMeta] = await Promise.all([
      this.libraryFileRepository.findGreaterThenVersion(armVersion),
      this.libraryFileRepository.findMetadataGreaterThenDate(parsedMetadataDate),
    ]);
    let result = {
      armUpdateExists: false,
      armVersion: null,
      metadataUpdateExists: false,
      metadataDate: null,
    };
    if (actualInstaller) {
      result.armUpdateExists = true;
      result.armVersion = actualInstaller.version;
    }
    if (actualMeta) {
      result.metadataUpdateExists = true;
      result.metadataDate = format(new Date(actualMeta.metadataDate), 'dd.MM.yyyy');
    }
    return result;
  }

  async getSpecifiedInstaller(armVersion: string, os: osInstallerType) {
    const installer = await this.libraryFileRepository.findByVersionAndType(armVersion, osToInstallersTypeMap[os]);
    if (!installer) LibraryFileException.InstallerNotFound();
    return await this.downloadFileService.download(installer.file.id);
  }

  async getSpecifiedMetaInstaller(metadataDate: string, os: osMetaType) {
    try {
      const metaInstaller = await this.libraryFileRepository.findByTypeAndMetadataDate(
        osToMetaTypeMap[os],
        metadataDate,
      );
      if (!metaInstaller) LibraryFileException.InstallerNotFound();
      return await this.downloadFileService.download(metaInstaller.file.id);
    } catch (e: any) {
      LoggerService.error(e?.message, e?.stack, 'INSTALLERS');
      throw e;
    }
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Response, UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { CreateLibraryFileService } from '@modules/library/application/create-library-file.service';
import { CreateLibraryFileRequestDto } from '@modules/library/controllers/dtos/create-library-file.request-dto';
import { FindLibraryFileService } from '@modules/library/application/find-library-file.service';
import { DeleteLibraryFileRequestDto } from '@modules/library/controllers/dtos/delete-library-file.request-dto';
import { DeleteLibraryFileService } from '@modules/library/application/delete-library-file.service';
import { UpdateLibraryFileRequestDto } from '@modules/library/controllers/dtos/update-library-file.request-dto';
import { UpdateLibraryFileService } from '@modules/library/application/update-library-file.service';
import { LibraryFileException } from '@modules/library/infrastructure/exceptions/library-file.exception';
import {
  CheckInstallerUpdatesService,
  osToInstallersTypeMap,
  osInstallerType,
  osMetaType,
  osToMetaTypeMap,
} from '@modules/library/application/check-installer-updates.service';
import { Response as ExpressResponse } from 'express';
import { JwtAuthGuard } from '@modules/user/infrastructure/guards/jwt-auth.guard';
import { UserId } from '@core/libs/user-id.decorator';
import { Page } from '@core/libs/page.decorator';
import { RequestQuery } from '@core/libs/types';
import { PermissionEnum } from '@modules/user/domain/permission.entity';
import { UseAuthPermissions } from '@core/libs/use-auth-permissions.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { ScormValidationPipe } from '@modules/course/infrastructure/scorm-validation.pipe';

@Controller('library')
export class LibraryController {
  constructor(
    private createLibraryService: CreateLibraryFileService,
    private findLibraryFileService: FindLibraryFileService,
    private deleteLibraryFileService: DeleteLibraryFileService,
    private updateLibraryFileService: UpdateLibraryFileService,
    private checkInstallerUpdatesService: CheckInstallerUpdatesService,
  ) {}

  @Page('Библиотека')
  @UseAuthPermissions(PermissionEnum.LIBRARY)
  @Get()
  async getAll(@Query() requestQuery: RequestQuery) {
    const [data, total] = await this.findLibraryFileService.findAll(requestQuery);
    return { data, total };
  }

  @UseGuards(JwtAuthGuard)
  @Get('CheckUpdateExists')
  async checkInstallersUpdate(
    @UserId() userId: string,
    @Query('armVersion') armVersion?: string,
    @Query('metadataDate') metadataDate?: string,
  ) {
    if (armVersion && metadataDate) {
      return await this.checkInstallerUpdatesService.checkUpdates(armVersion, metadataDate);
    }
    LibraryFileException.QueryParamsError(
      `Пользователь id=${userId}. В запросе CheckUpdateExists  не указан обязательный параметр`,
      'armVersion',
      'metadataDate',
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('GetSpecifiedArmInstaller')
  async getSpecifiedInstaller(
    @Response() res: ExpressResponse,
    @UserId() userId: string,
    @Query('armVersion') armVersion?: string,
    @Query('os') os?: osInstallerType,
  ) {
    if (!armVersion || !os)
      LibraryFileException.QueryParamsError(
        `Пользователь id=${userId}. В запросе GetSpecifiedArmInstaller не указан обязательный параметр`,
        'armVersion',
        'os',
      );
    if (!osToInstallersTypeMap[os])
      LibraryFileException.InvalidOs(
        `Пользователь id=${userId}. При загрузке инсталлятора указано неверное значение параметра os`,
      );
    const { file, fileStream } = await this.checkInstallerUpdatesService.getSpecifiedInstaller(armVersion, os);
    const filename = encodeURIComponent(`${file.fileName}.${file.extension}`);
    res.setHeader('Content-Disposition', `filename=` + filename);
    res.setHeader('Content-Type', file.mimetype);
    fileStream.pipe(res);
  }

  @UseGuards(JwtAuthGuard)
  @Get('GetSpecifiedMetadataInstaller')
  async getSpecifiedMetaInstaller(
    @Response() res: ExpressResponse,
    @UserId() userId: string,
    @Query('metadataDate') metadataDate?: string,
    @Query('os') os?: osMetaType,
  ) {
    if (!metadataDate || !os)
      LibraryFileException.QueryParamsError(
        `Пользователь id=${userId}. В запросе GetSpecifiedMetadataInstaller не указан обязательный параметр`,
        'metadataDate',
        'os',
      );
    if (!osToMetaTypeMap[os])
      LibraryFileException.InvalidOs(
        `Пользователь id=${userId}. При загрузке инсталлятора указано неверное значение параметра os`,
      );
    const { file, fileStream } = await this.checkInstallerUpdatesService.getSpecifiedMetaInstaller(metadataDate, os);
    const filename = encodeURIComponent(`${file.fileName}.${file.extension}`);
    res.setHeader('Content-Disposition', `filename=` + filename);
    res.setHeader('Content-Type', file.mimetype);
    fileStream.pipe(res);
  }

  @UseAuthPermissions(PermissionEnum.LIBRARY)
  @Get(':id')
  async getById(@Param('id') id: string) {
    return await this.findLibraryFileService.findById(id);
  }

  @Page('АРМ «Правовая статистика», АРМ КУСП для Windows')
  @UseAuthPermissions(PermissionEnum.INSTALLERS)
  @Get('installers/win')
  async getInstallersWin() {
    return await this.findLibraryFileService.findInstallersWin();
  }

  @Page('АРМ «Правовая статистика», АРМ КУСП для Linux')
  @UseAuthPermissions(PermissionEnum.INSTALLERS)
  @Get('installers/lin')
  async getInstallerLin() {
    return await this.findLibraryFileService.findInstallerLin();
  }

  @Page('Инсталлятор метаданных')
  @UseAuthPermissions(PermissionEnum.INSTALLERS)
  @Get('installers/meta')
  async getInstallersMeta() {
    return await this.findLibraryFileService.findInstallersMeta();
  }

  @UseInterceptors(FileInterceptor('file'))
  @UseAuthPermissions(PermissionEnum.LIBRARY_CREATE)
  @Post()
  async create(
    @Body() libraryFileDto: CreateLibraryFileRequestDto,
    @UploadedFile() file: Express.Multer.File,
    @UserId() userId: string
  ) {
    return await this.createLibraryService.create(libraryFileDto, file, userId);
  }

  @UseInterceptors(FileInterceptor('file'))
  @UseAuthPermissions(PermissionEnum.INSTALLERS_CREATE)
  @Post('installer')
  async createInstallerFile(
    @Body() installerFileDto: CreateLibraryFileRequestDto,
    @UploadedFile() file: Express.Multer.File,
    @UserId() userId: string
  ) {
    return await this.createLibraryService.createInstaller(installerFileDto, file, userId);
  }

  @UseAuthPermissions(PermissionEnum.LIBRARY_EDIT)
  @Put()
  async update(@Body() libraryFileDto: UpdateLibraryFileRequestDto, @UserId() userId: string) {
    return await this.updateLibraryFileService.update(libraryFileDto, userId);
  }

  @UseAuthPermissions(PermissionEnum.LIBRARY_DELETE)
  @Delete()
  async deleteMany(@Body() libraryFileDto: DeleteLibraryFileRequestDto) {
    return await this.deleteLibraryFileService.deleteMany(libraryFileDto);
  }
}

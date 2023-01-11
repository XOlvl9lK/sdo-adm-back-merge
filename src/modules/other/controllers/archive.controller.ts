import { Body, Controller, Param, Put } from '@nestjs/common';
import { entitiesMap } from '@core/libs/entitiesMap';
import { BaseException } from '@core/exceptions/base.exception';
import { ArchiveService } from '@modules/other/application/archive.service';
import { ArchiveDto } from '@modules/other/controllers/dtos/archive.dto';

@Controller()
export class ArchiveController {
  constructor(
    private archiveService: ArchiveService
  ) {}

  @Put('archive/:entity')
  async archiveMany(@Param('entity') entity: keyof typeof entitiesMap, @Body() archiveDto: ArchiveDto) {
    if (!entitiesMap[entity]) BaseException.BadRequest(null);
    return await this.archiveService.archive(entitiesMap[entity] as any, archiveDto);
  }

  @Put('unzip/:entity')
  async unzipMany(@Param('entity') entity: keyof typeof entitiesMap, @Body() archiveDto: ArchiveDto) {
    if (!entitiesMap[entity]) BaseException.BadRequest(null);
    return await this.archiveService.unzip(entitiesMap[entity] as any, archiveDto);
  }
}

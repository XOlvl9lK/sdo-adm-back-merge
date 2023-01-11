import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CreateProgramSettingsService } from '@modules/program-settings/application/create-program-settings.service';
import { CreateProgramSettingsDto } from '@modules/program-settings/controllers/dtos/create-program-settings.dto';
import { FindProgramSettingsService } from '@modules/program-settings/application/find-program-settings.service';
import { UpdateProgramSettingsDto } from '@modules/program-settings/controllers/dtos/update-program-settings.dto';
import { UpdateProgramSettingsService } from '@modules/program-settings/application/update-program-settings.service';
import { DeleteProgramSettingsDto } from '@modules/program-settings/controllers/dtos/delete-program-settings.dto';
import { DeleteProgramSettingsService } from '@modules/program-settings/application/delete-program-settings.service';
import { Page } from '@core/libs/page.decorator';
import { RequestQuery } from '@core/libs/types';
import { PermissionEnum } from '@modules/user/domain/permission.entity';
import { UseAuthPermissions } from '@core/libs/use-auth-permissions.decorator';

@Controller('program-settings')
export class ProgramSettingsController {
  constructor(
    private createProgramSettingsService: CreateProgramSettingsService,
    private findProgramSettingsService: FindProgramSettingsService,
    private updateProgramSettingsService: UpdateProgramSettingsService,
    private deleteProgramSettingsService: DeleteProgramSettingsService,
  ) {}

  @Page('Настройка программ обучения')
  @UseAuthPermissions(PermissionEnum.PROGRAM_SETTINGS)
  @Get()
  async findAll(@Query() requestQuery: RequestQuery) {
    const [settings, total] = await this.findProgramSettingsService.findAll(requestQuery);
    return {
      total,
      data: settings,
    };
  }

  @Page('Настройка программ обучения')
  @UseAuthPermissions(PermissionEnum.PROGRAM_SETTINGS)
  @Get(':id')
  async getById(@Param('id') id: string) {
    return await this.findProgramSettingsService.findById(id);
  }

  @UseAuthPermissions(PermissionEnum.PROGRAM_SETTINGS_CREATE)
  @Post()
  async create(@Body() programSettingsDto: CreateProgramSettingsDto) {
    return await this.createProgramSettingsService.create(programSettingsDto);
  }

  @UseAuthPermissions(PermissionEnum.PROGRAM_SETTINGS_EDIT)
  @Put('set-obligatory')
  async addObligatory(@Body() programSettingsDto: UpdateProgramSettingsDto) {
    return await this.updateProgramSettingsService.updateObligatory(programSettingsDto);
  }

  @UseAuthPermissions(PermissionEnum.PROGRAM_SETTINGS_EDIT)
  @Put('set-optional')
  async addOptional(@Body() programSettingsDto: UpdateProgramSettingsDto) {
    return await this.updateProgramSettingsService.updateOptional(programSettingsDto);
  }

  @UseAuthPermissions(PermissionEnum.PROGRAM_SETTINGS_DELETE)
  @Delete()
  async deleteMany(@Body() programSettingsDto: DeleteProgramSettingsDto) {
    return await this.deleteProgramSettingsService.deleteMany(programSettingsDto);
  }
}

import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { FindRegisteredUsersDto } from '@modules/other/controllers/dtos/find-registered-users.dto';
import { RegisteredUsersService } from '@modules/control/application/registered-users.service';
import { Response } from 'express';
import { RequestQuery } from '@core/libs/types';
import { Page } from '@core/libs/page.decorator';
import { PermissionEnum } from '@modules/user/domain/permission.entity';
import { ExportRegisteredUsersDto } from '@modules/control/controllers/dtos/export-registered-users.dto';
import { UseAuthPermissions } from '@core/libs/use-auth-permissions.decorator';
import { UserId } from '@core/libs/user-id.decorator';

@Controller('control/registered-users')
export class RegisteredUsersController {
  constructor(private registeredUsersService: RegisteredUsersService) {}

  @Page('Зарегестрированные пользователи')
  @UseAuthPermissions(PermissionEnum.CONTROL_REGISTERED)
  @Get()
  async getRegisteredUsers(@Query() query: FindRegisteredUsersDto & RequestQuery) {
    return await this.registeredUsersService.getRegisteredUsers(query, query);
  }

  @UseAuthPermissions(PermissionEnum.CONTROL_EXPORT)
  @Post('export-xlsx')
  async exportXlsx(@Res() response: Response, @Body() dto: ExportRegisteredUsersDto, @UserId() userId: string) {
    return await this.registeredUsersService.exportXlsx(dto, response, userId);
  }

  @UseAuthPermissions(PermissionEnum.CONTROL_EXPORT)
  @Post('export-xls')
  async exportXls(@Res() response: Response, @Body() dto: ExportRegisteredUsersDto, @UserId() userId: string) {
    return await this.registeredUsersService.exportXls(dto, response, userId);
  }

  @UseAuthPermissions(PermissionEnum.CONTROL_EXPORT)
  @Post('export-ods')
  async exportOds(@Res() response: Response, @Body() dto: ExportRegisteredUsersDto, @UserId() userId: string) {
    return await this.registeredUsersService.exportOds(dto, response, userId);
  }

  @UseAuthPermissions(PermissionEnum.CONTROL_PRINT)
  @Post('print')
  async printRegisteredUsers(@Res() response: Response, @Body() dto: ExportRegisteredUsersDto, @UserId() userId: string) {
    return await this.registeredUsersService.printRegisteredUsers(dto, response, userId);
  }
}

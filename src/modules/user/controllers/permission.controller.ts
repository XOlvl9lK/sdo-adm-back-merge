import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreatePermissionService } from '@modules/user/application/create-permission.service';
import { CreatePermissionDto } from '@modules/user/controllers/dtos/create-permission.dto';
import { RequestQuery } from '@core/libs/types';
import { FindPermissionService } from '@modules/user/application/find-permission.service';
import { PermissionEnum } from '@modules/user/domain/permission.entity';
import { UseAuthPermissions } from '@core/libs/use-auth-permissions.decorator';

@Controller('permission')
export class PermissionController {
  constructor(
    private createPermissionService: CreatePermissionService,
    private findPermissionService: FindPermissionService,
  ) {}

  @UseAuthPermissions(PermissionEnum.ROLE)
  @Get()
  async getAll(@Query() requestQuery: RequestQuery) {
    const [data, total] = await this.findPermissionService.findAll(requestQuery);
    return { data, total };
  }

  @Post()
  async create(@Body() permissionDto: CreatePermissionDto) {
    return await this.createPermissionService.create(permissionDto);
  }
}

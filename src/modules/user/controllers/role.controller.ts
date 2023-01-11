import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CreateRoleDto } from '@modules/user/controllers/dtos/create-role.dto';
import { CreateRoleService } from '@modules/user/application/create-role.service';
import { FindRoleService } from '@modules/user/application/find-role.service';
import { IPaginatedResponse, RequestQuery } from '@core/libs/types';
import { UpdateRoleDto } from '@modules/user/controllers/dtos/update-role.dto';
import { UpdateRoleService } from '@modules/user/application/update-role.service';
import { MoveUsersDto } from '@modules/user/controllers/dtos/move-users.dto';
import { DeleteManyRoleDto } from '@modules/user/controllers/dtos/delete-many-role.dto';
import { DeleteRoleService } from '@modules/user/application/delete-role.service';
import { UpdatePermissionsDto } from '@modules/user/controllers/dtos/update-permissions.dto';
import { RoleEntity } from '@modules/user/domain/role.entity';
import { UserId } from '@core/libs/user-id.decorator';
import { PermissionEnum } from '@modules/user/domain/permission.entity';
import { UseAuthPermissions } from '@core/libs/use-auth-permissions.decorator';

@Controller('role')
export class RoleController {
  constructor(
    private createRoleService: CreateRoleService,
    private findRoleService: FindRoleService,
    private updateRoleService: UpdateRoleService,
    private deleteRoleService: DeleteRoleService,
  ) {}

  @UseAuthPermissions(PermissionEnum.ROLE)
  @Get()
  async getAll(@Query() requestQuery: RequestQuery): Promise<IPaginatedResponse<RoleEntity[]>> {
    const [roles, total] = await this.findRoleService.findAll(requestQuery);
    return {
      data: roles,
      total,
    };
  }

  @UseAuthPermissions(PermissionEnum.ROLE)
  @Get('with-users/:id')
  async getByIdWithUsers(@Param('id') id: string, @Query() requestQuery: RequestQuery) {
    return await this.findRoleService.findByIdWithUser(id, requestQuery);
  }

  @UseAuthPermissions(PermissionEnum.ROLE)
  @Get('absent-users/:id')
  async getAbsentUsers(@Param('id') id: string, @Query() requestQuery: RequestQuery) {
    const [data, total] = await this.findRoleService.findAbsentUsers(id, requestQuery);
    return { data, total };
  }

  @UseAuthPermissions(PermissionEnum.ROLE)
  @Get(':id')
  async getById(@Param('id') id: string) {
    return await this.findRoleService.findById(id);
  }

  @UseAuthPermissions(PermissionEnum.ROLE_CREATE)
  @Post()
  async create(@Body() roleDto: CreateRoleDto, @UserId() userId: string) {
    return this.createRoleService.create(roleDto, userId);
  }

  @UseAuthPermissions(PermissionEnum.ROLE_EDIT)
  @Put()
  async update(@Body() roleDto: UpdateRoleDto, @UserId() userId: string) {
    return await this.updateRoleService.update(roleDto, userId);
  }

  @UseAuthPermissions(PermissionEnum.ROLE_EDIT)
  @Put('move-users')
  async moveUsers(@Body() roleDto: MoveUsersDto) {
    return await this.updateRoleService.moveUsers(roleDto);
  }

  @UseAuthPermissions(PermissionEnum.ROLE_EDIT)
  @Put('permissions')
  async updatePermissions(@Body() roleDto: UpdatePermissionsDto) {
    return await this.updateRoleService.updatePermissions(roleDto);
  }

  @UseAuthPermissions(PermissionEnum.ROLE_DELETE)
  @Delete()
  async deleteMany(@Body() roleDto: DeleteManyRoleDto, @UserId() userId: string) {
    return await this.deleteRoleService.deleteMany(roleDto, userId);
  }
}

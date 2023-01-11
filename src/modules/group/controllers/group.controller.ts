import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CreateGroupService } from '@modules/group/application/create-group.service';
import { CreateGroupRequestDto } from '@modules/group/controllers/dtos/create-group.request-dto';
import { AddUsersRequestDto } from '@modules/group/controllers/dtos/add-user.request-dto';
import { UpdateGroupService } from '@modules/group/application/update-group.service';
import { FindGroupService } from '@modules/group/application/find-group.service';
import { MoveUsersRequestDto } from '@modules/group/controllers/dtos/move-users.request-dto';
import { UpdateGroupDtoRequest } from '@modules/group/controllers/dtos/update-group.dto-request';
import { RequestQuery } from '@core/libs/types';
import { UserId } from '@core/libs/user-id.decorator';
import { Page } from '@core/libs/page.decorator';
import { GetAllGroupsDto } from '@modules/group/controllers/dtos/get-all-groups.dto';
import { PermissionEnum } from '@modules/user/domain/permission.entity';
import { UseAuthPermissions } from '@core/libs/use-auth-permissions.decorator';
import { LoggerService } from '@core/logger/logger.service';

@Controller('group')
export class GroupController {
  constructor(
    private createGroupService: CreateGroupService,
    private updateGroupService: UpdateGroupService,
    private findGroupService: FindGroupService,
  ) {}

  @Page('Группы')
  @UseAuthPermissions(PermissionEnum.GROUP)
  @Get()
  async getAll(@Query() requestQuery: RequestQuery & GetAllGroupsDto) {
    const [data, total] = await this.findGroupService.findAll(requestQuery, requestQuery);
    return { data, total };
  }

  @Page('Группы')
  @UseAuthPermissions(PermissionEnum.GROUP)
  @Get(':id')
  async getById(@Param('id') id: string, @Query() requestQuery: RequestQuery) {
    return await this.findGroupService.findById(id, requestQuery);
  }

  @Page('Группы')
  @UseAuthPermissions(PermissionEnum.GROUP)
  @Get('without-pagination/:id')
  async getByIdWithoutPagination(@Param('id') id: string) {
    return await this.findGroupService.findByIdWithoutPagination(id);
  }

  @Page('Группы')
  @UseAuthPermissions(PermissionEnum.USERS)
  @Get('by-user/:userId')
  async getByUserId(@Param('userId') userId: string) {
    return await this.findGroupService.findByUserId(userId);
  }

  @UseAuthPermissions(PermissionEnum.GROUP_CREATE)
  @Post()
  async create(@Body() groupDto: CreateGroupRequestDto, @UserId() userId: string) {
    return await this.createGroupService.create(groupDto, userId);
  }

  @UseAuthPermissions(PermissionEnum.GROUP_EDIT)
  @Put()
  async update(@Body() groupDto: UpdateGroupDtoRequest, @UserId() userId: string) {
    return await this.updateGroupService.update(groupDto, userId);
  }

  @UseAuthPermissions(PermissionEnum.GROUP_EDIT)
  @Put('add')
  async addUsers(@Body() addUsersDto: AddUsersRequestDto) {
    return await this.updateGroupService.addUsers(addUsersDto);
  }

  @UseAuthPermissions(PermissionEnum.GROUP_EDIT)
  @Put('remove')
  async removeUsers(@Body() removeUsersDto: AddUsersRequestDto) {
    return await this.updateGroupService.removeUsers(removeUsersDto);
  }

  @UseAuthPermissions(PermissionEnum.GROUP_EDIT)
  @Put('move')
  async moveUsers(@Body() moveUsersDto: MoveUsersRequestDto) {
    return await this.updateGroupService.moveUsers(moveUsersDto);
  }
}

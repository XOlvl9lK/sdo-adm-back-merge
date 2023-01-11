import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CreateForumMessageService } from '@modules/forum/application/create-forum-message.service';
import { CreateForumMessageDto } from '@modules/forum/controllers/dtos/create-forum-message.dto';
import { DeleteForumMessageService } from '@modules/forum/application/delete-forum-message.service';
import { FindForumMessageService } from '@modules/forum/application/find-forum-message.service';
import { UserId } from '@core/libs/user-id.decorator';
import { RequestQuery } from '@core/libs/types';
import { Page } from '@core/libs/page.decorator';
import { MoveForumMessageDto, UpdateForumMessageDto } from '@modules/forum/controllers/dtos/update-forum-message.dto';
import { UpdateForumMessageService } from '@modules/forum/application/update-forum-message.service';
import { PermissionEnum } from '@modules/user/domain/permission.entity';
import { UseAuthPermissions } from '@core/libs/use-auth-permissions.decorator';

@Controller('forum-message')
export class ForumMessageController {
  constructor(
    private createForumMessageService: CreateForumMessageService,
    private deleteForumMessageService: DeleteForumMessageService,
    private findForumMessageService: FindForumMessageService,
    private updateForumMessageService: UpdateForumMessageService,
  ) {}

  @UseAuthPermissions(PermissionEnum.FORUM)
  @Get(':id')
  async getById(@Param('id') id: string) {
    return await this.findForumMessageService.findById(id);
  }

  @UseAuthPermissions(PermissionEnum.FORUM)
  @Get('by-theme/:themeId')
  async getByThemeId(@Param('themeId') themeId: string, @Query() requestQuery: RequestQuery) {
    return await this.findForumMessageService.findByThemeId(themeId, requestQuery);
  }

  @Page('Форум')
  @UseAuthPermissions(PermissionEnum.FORUM_MODERATION, PermissionEnum.FORUM_CREATE_MESSAGE)
  @Post()
  async create(@Body() forumMessageDto: CreateForumMessageDto, @UserId() userId: string) {
    return await this.createForumMessageService.create(forumMessageDto, userId);
  }

  @UseAuthPermissions(PermissionEnum.FORUM_MODERATION, PermissionEnum.FORUM_EDIT_MESSAGE)
  @Put()
  async update(@Body() forumMessageDto: UpdateForumMessageDto, @UserId() userId: string) {
    return await this.updateForumMessageService.update(forumMessageDto, userId);
  }

  @UseAuthPermissions(PermissionEnum.FORUM_MODERATION)
  @Put('move')
  async moveForumMessage(@Body() forumMessageDto: MoveForumMessageDto) {
    return await this.updateForumMessageService.moveForumMessage(forumMessageDto);
  }

  @UseAuthPermissions(PermissionEnum.FORUM_MODERATION, PermissionEnum.FORUM_DELETE_MESSAGE)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.deleteForumMessageService.delete(id);
  }
}

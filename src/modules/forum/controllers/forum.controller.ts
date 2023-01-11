import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { FindForumService } from '@modules/forum/application/find-forum.service';
import { CreateForumService } from '@modules/forum/application/create-forum.service';
import { CreateForumDto } from '@modules/forum/controllers/dtos/create-forum.dto';
import { DeleteForumService } from '@modules/forum/application/delete-forum.service';
import { UserId } from '@core/libs/user-id.decorator';
import { Page } from '@core/libs/page.decorator';
import { ChangeForumOrderDto, UpdateForumDto } from '@modules/forum/controllers/dtos/update-forum.dto';
import { UpdateForumService } from '@modules/forum/application/update-forum.service';
import { PermissionEnum } from '@modules/user/domain/permission.entity';
import { RequestQuery } from '@core/libs/types';
import { UseAuthPermissions } from '@core/libs/use-auth-permissions.decorator';

@Controller('forum')
export class ForumController {
  constructor(
    private findForumService: FindForumService,
    private createForumService: CreateForumService,
    private deleteForumService: DeleteForumService,
    private updateForumService: UpdateForumService,
  ) {}

  @Page('Форум')
  @UseAuthPermissions(PermissionEnum.FORUM)
  @Get()
  async getAll(@Query() requestQuery: RequestQuery) {
    const [data, total] = await this.findForumService.findAll(requestQuery);
    return { data, total };
  }

  @UseAuthPermissions(PermissionEnum.FORUM)
  @Get(':id')
  async getById(@Param('id') id: string) {
    return await this.findForumService.findById(id);
  }

  @UseAuthPermissions(PermissionEnum.FORUM_MODERATION)
  @Post()
  async create(@Body() forumDto: CreateForumDto, @UserId() userId: string) {
    return await this.createForumService.create(forumDto, userId);
  }

  @UseAuthPermissions(PermissionEnum.FORUM_MODERATION)
  @Put()
  async update(@Body() forumDto: UpdateForumDto, @UserId() userId: string) {
    return await this.updateForumService.update(forumDto, userId);
  }

  @UseAuthPermissions(PermissionEnum.FORUM_MODERATION)
  @Put('order')
  async changeOrder(@Body() forumDto: ChangeForumOrderDto, @UserId() userId: string) {
    return await this.updateForumService.changeOrder(forumDto, userId);
  }

  @UseAuthPermissions(PermissionEnum.FORUM_MODERATION)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.deleteForumService.delete(id);
  }
}

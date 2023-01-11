import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { CreateThemeService } from '@modules/forum/application/create-theme.service';
import { FindThemeService } from '@modules/forum/application/find-theme.service';
import { CreateThemeDto } from '@modules/forum/controllers/dtos/create-theme.dto';
import { DeleteThemeService } from '@modules/forum/application/delete-theme.service';
import { UpdateThemeService } from '@modules/forum/application/update-theme.service';
import { JwtAuthGuard } from '@modules/user/infrastructure/guards/jwt-auth.guard';
import { UserId } from '@core/libs/user-id.decorator';
import { RequestQuery } from '@core/libs/types';
import { Page } from '@core/libs/page.decorator';
import { UpdateThemeDto } from '@modules/forum/controllers/dtos/update-theme.dto';
import { PermissionEnum } from '@modules/user/domain/permission.entity';
import { UseAuthPermissions } from '@core/libs/use-auth-permissions.decorator';

@Controller('theme')
export class ThemeController {
  constructor(
    private createThemeService: CreateThemeService,
    private findThemeService: FindThemeService,
    private deleteThemeService: DeleteThemeService,
    private updateThemeService: UpdateThemeService,
  ) {}

  @Page('Форум')
  @UseAuthPermissions(PermissionEnum.FORUM)
  @Get()
  async getAll() {
    return await this.findThemeService.findAll();
  }

  @Page('Форум')
  @UseAuthPermissions(PermissionEnum.FORUM)
  @Get('by-forum/:forumId')
  async getByForumId(@Param('forumId') forumId: string, @Query() requestQuery: RequestQuery) {
    return await this.findThemeService.findByForumId(forumId, requestQuery);
  }

  @UseAuthPermissions(PermissionEnum.FORUM)
  @Get(':id')
  async getById(@Param('id') id: string) {
    return await this.findThemeService.findById(id);
  }

  @UseAuthPermissions(PermissionEnum.FORUM_MODERATION, PermissionEnum.FORUM_CREATE_THEME)
  @Post()
  async create(@Body() themeDto: CreateThemeDto, @UserId() userId: string) {
    return await this.createThemeService.create(themeDto, userId);
  }

  @UseAuthPermissions(PermissionEnum.FORUM_MODERATION, PermissionEnum.FORUM_EDIT_THEME)
  @Put()
  async update(@Body() themeDto: UpdateThemeDto, @UserId() userId: string) {
    return await this.updateThemeService.update(themeDto, userId);
  }

  @UseAuthPermissions(PermissionEnum.FORUM_MODERATION)
  @Put('close/:id')
  async closeTheme(@Param('id') id: string, @UserId() userId: string) {
    return await this.updateThemeService.close(id, userId);
  }

  @UseAuthPermissions(PermissionEnum.FORUM_MODERATION)
  @Put('fix/:id')
  async fixTheme(@Param('id') id: string, @UserId() userId: string) {
    return await this.updateThemeService.fix(id, userId);
  }

  @UseAuthPermissions(PermissionEnum.FORUM_MODERATION)
  @Put('open/:id')
  async openTheme(@Param('id') id: string, @UserId() userId: string) {
    return await this.updateThemeService.open(id, userId);
  }

  @UseAuthPermissions(PermissionEnum.FORUM_MODERATION)
  @Put('unpin/:id')
  async unpinTheme(@Param('id') id: string, @UserId() userId: string) {
    return await this.updateThemeService.unpin(id, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.deleteThemeService.delete(id);
  }
}

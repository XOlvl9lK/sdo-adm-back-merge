import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CreateNewsGroupService } from '@modules/news/application/create-news-group.service';
import { Page } from '@core/libs/page.decorator';
import { PermissionEnum } from '@modules/user/domain/permission.entity';
import { RequestQuery } from '@core/libs/types';
import { FindNewsGroupService } from '@modules/news/application/find-news-group.service';
import { CreateNewsGroupDto } from '@modules/news/controllers/dtos/create-news-group.dto';
import { UserId } from '@core/libs/user-id.decorator';
import { UpdateNewsGroupDto } from '@modules/news/controllers/dtos/update-news-group.dto';
import { UpdateNewsGroupService } from '@modules/news/application/update-news-group.service';
import { UseAuthPermissions } from '@core/libs/use-auth-permissions.decorator';
import { LoggerService } from '@core/logger/logger.service';

@Controller('news-group')
export class NewsGroupController {
  constructor(
    private findNewsGroupService: FindNewsGroupService,
    private createNewsGroupService: CreateNewsGroupService,
    private updateNewsGroupService: UpdateNewsGroupService,
  ) {}

  @Page('Банк новостей')
  @UseAuthPermissions(PermissionEnum.NEWS_GROUP)
  @Get()
  async getAll(@Query() requestQuery: RequestQuery) {
    const [data, total] = await this.findNewsGroupService.findAll(requestQuery);
    return { data, total };
  }

  @UseAuthPermissions(PermissionEnum.NEWS_GROUP)
  @Get(':id')
  async getById(@Param('id') id: string, @Query() requestQuery: RequestQuery) {
    LoggerService.log('CONTROLLER GET REQUEST', '[CONNECTION RESET PROBLEM]')
    return await this.findNewsGroupService.findById(id, requestQuery);
  }

  @UseAuthPermissions(PermissionEnum.NEWS_GROUP_CREATE)
  @Post()
  async create(@Body() newsGroupDto: CreateNewsGroupDto, @UserId() userId: string) {
    return await this.createNewsGroupService.create(newsGroupDto, userId);
  }

  @UseAuthPermissions(PermissionEnum.NEWS_GROUP_EDIT)
  @Put()
  async update(@Body() newsGroupDto: UpdateNewsGroupDto, @UserId() userId: string) {
    return await this.updateNewsGroupService.update(newsGroupDto, userId);
  }
}

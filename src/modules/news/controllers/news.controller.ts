import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { CreateNewsService } from '@modules/news/application/create-news.service';
import { CreateNewsRequestDto } from '@modules/news/controllers/dtos/create-news.request-dto';
import { FindNewsService } from '@modules/news/application/find-news.service';
import { Page } from '@core/libs/page.decorator';
import { UnStrictJwtAuthGuard } from '@modules/user/infrastructure/guards/unstrict-jwt-auth.guard';
import { PermissionEnum } from '@modules/user/domain/permission.entity';
import { MoveNewsDto, UpdateNewsDto } from '@modules/news/controllers/dtos/update-news.dto';
import { UpdateNewsService } from '@modules/news/application/update-news.service';
import { UserId } from '@core/libs/user-id.decorator';
import { RequestQuery } from '@core/libs/types';
import { UseAuthPermissions } from '@core/libs/use-auth-permissions.decorator';

@Controller('news')
export class NewsController {
  constructor(
    private createNewsService: CreateNewsService,
    private findNewsService: FindNewsService,
    private updateNewsService: UpdateNewsService,
  ) {}

  @Page('Новости')
  @UseGuards(UnStrictJwtAuthGuard)
  @Get()
  async getAll(@Query() requestQuery: RequestQuery) {
    const [data, total] = await this.findNewsService.findAll(requestQuery);
    return { data, total };
  }

  @UseGuards(UnStrictJwtAuthGuard)
  @Get(':id')
  async getById(@Param('id') id: string) {
    return await this.findNewsService.findById(id);
  }

  @UseGuards(UnStrictJwtAuthGuard)
  @Get('by-group/:groupId')
  async getByGroupId(@Param('groupId') groupId: string, @Query() requestQuery: RequestQuery) {
    const [data, total] = await this.findNewsService.findByGroupId(groupId, requestQuery);
    return { data, total };
  }

  @UseAuthPermissions(PermissionEnum.NEWS_CREATE)
  @Post()
  async create(@Body() newsDto: CreateNewsRequestDto, @UserId() userId: string) {
    return await this.createNewsService.create(newsDto, userId);
  }

  @UseAuthPermissions(PermissionEnum.NEWS_EDIT)
  @Put()
  async update(@Body() newsDto: UpdateNewsDto, @UserId() userId: string) {
    return await this.updateNewsService.update(newsDto, userId);
  }

  @UseAuthPermissions(PermissionEnum.NEWS_EDIT)
  @Put('move')
  async move(@Body() newsDto: MoveNewsDto) {
    return await this.updateNewsService.move(newsDto);
  }
}

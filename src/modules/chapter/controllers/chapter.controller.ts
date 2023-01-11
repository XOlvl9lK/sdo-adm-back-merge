import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CreateChapterService } from '@modules/chapter/application/create-chapter.service';
import { CreateChapterDto } from '@modules/chapter/controllers/dtos/create-chapter.dto';
import { FindChapterService } from '@modules/chapter/application/find-chapter.service';
import { RequestQuery } from '@core/libs/types';
import { UpdateChapterDto } from '@modules/chapter/controllers/dtos/update-chapter.dto';
import { UpdateChapterService } from '@modules/chapter/application/update-chapter.service';
import { UserId } from '@core/libs/user-id.decorator';
import { PermissionEnum } from '@modules/user/domain/permission.entity';
import { Page } from '@core/libs/page.decorator';
import { UseAuthPermissions } from '@core/libs/use-auth-permissions.decorator';

@Controller('chapter')
export class ChapterController {
  constructor(
    private createChapterService: CreateChapterService,
    private findChapterService: FindChapterService,
    private updateChapterService: UpdateChapterService,
  ) {}

  @Page('Разделы элементов обучения')
  @UseAuthPermissions(PermissionEnum.CHAPTER)
  @Get()
  async getAll(@Query() requestQuery: RequestQuery) {
    const [data, total] = await this.findChapterService.findAll(requestQuery);
    return { data, total };
  }

  @Get('without-pagination')
  async getAllWithoutPagination(@Query() requestQuery: RequestQuery) {
    return await this.findChapterService.findAllWithoutPagination(requestQuery);
  }

  @UseAuthPermissions(PermissionEnum.CHAPTER)
  @Get(':id')
  async getById(@Param('id') id: string) {
    return await this.findChapterService.findById(id);
  }

  @UseAuthPermissions(PermissionEnum.CHAPTER_CREATE)
  @Post()
  async create(@Body() chapterDto: CreateChapterDto, @UserId() userId: string) {
    return await this.createChapterService.create(chapterDto, userId);
  }

  @UseAuthPermissions(PermissionEnum.CHAPTER_EDIT)
  @Put()
  async update(@Body() chapterDto: UpdateChapterDto, @UserId() userId: string) {
    return await this.updateChapterService.update(chapterDto, userId);
  }
}

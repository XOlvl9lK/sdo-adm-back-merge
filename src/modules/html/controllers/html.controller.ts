import { Body, Controller, Get, Param, Put, Query, UseGuards } from '@nestjs/common';
import { CreateHtmlService } from '@modules/html/application/create-html.service';
import { FindHtmlService } from '@modules/html/application/find-html.service';
import { CreateHtmlRequestDto } from '@modules/html/controllers/dtos/create-html.request-dto';
import { UpdateHtmlService } from '@modules/html/application/update-html.service';
import { PageEnum } from '@modules/html/domain/page-content.entity';
import { HtmlException } from '@modules/html/infrastructure/exceptions/html.exception';
import { RequestQuery } from '@core/libs/types';
import { UserId } from '@core/libs/user-id.decorator';
import { UnStrictJwtAuthGuard } from '@modules/user/infrastructure/guards/unstrict-jwt-auth.guard';
import { Page } from '@core/libs/page.decorator';
import { PermissionEnum } from '@modules/user/domain/permission.entity';
import { UseAuthPermissions } from '@core/libs/use-auth-permissions.decorator';

@Controller('html')
export class HtmlController {
  constructor(
    private createHtmlService: CreateHtmlService,
    private findHtmlService: FindHtmlService,
    private updateHtmlService: UpdateHtmlService,
  ) {}

  @UseAuthPermissions(PermissionEnum.PAGE_BANK)
  @Get()
  async getAll(@Query() requestQuery: RequestQuery) {
    return await this.findHtmlService.findAll(requestQuery);
  }

  @Page('Главная')
  @UseGuards(UnStrictJwtAuthGuard)
  @Get(PageEnum.MAIN)
  async getMainPage() {
    return await this.findHtmlService.findByPageType(PageEnum.MAIN);
  }

  @Page('Контакты')
  @UseGuards(UnStrictJwtAuthGuard)
  @Get(PageEnum.CONTACTS)
  async getContactsPage() {
    return await this.findHtmlService.findByPageType(PageEnum.CONTACTS);
  }

  @Get(':page')
  async getPage(@Param('page') page: string) {
    if (Object.values(PageEnum).includes(page as PageEnum)) {
      return await this.findHtmlService.findByPageType(page as PageEnum);
    }
    HtmlException.NotFound();
  }

  @UseAuthPermissions(PermissionEnum.PAGE_BANK_EDIT)
  @Put(':page')
  async updatePage(@Param('page') page: string, @Body() pageDto: CreateHtmlRequestDto, @UserId() userId: string) {
    if (Object.values(PageEnum).includes(page as PageEnum)) {
      return await this.updateHtmlService.update(pageDto, page as PageEnum, userId);
    }
    HtmlException.NotFound();
  }
}

import { Body, Controller, Post } from '@nestjs/common';
import { GetBreadcrumbsDto } from '@modules/breadcrumbs/controllers/dto/get-breadcrumbs.dto';
import { BreadcrumbsService } from '@modules/breadcrumbs/application/breadcrumbs.service';

@Controller('breadcrumbs')
export class BreadcrumbsController {
  constructor(
    private breadcrumbsService: BreadcrumbsService
  ) {}

  @Post()
  async getBreadcrumbs(@Body() dto: GetBreadcrumbsDto) {
    return await this.breadcrumbsService.getBreadcrumbs(dto)
  }
}
import { Module } from '@nestjs/common';
import { BreadcrumbsController } from '@modules/breadcrumbs/controllers/breadcrumbs.controller';
import { BreadcrumbsService } from '@modules/breadcrumbs/application/breadcrumbs.service';

@Module({
  controllers: [BreadcrumbsController],
  providers: [BreadcrumbsService]
})
export class BreadcrumbsModule {}

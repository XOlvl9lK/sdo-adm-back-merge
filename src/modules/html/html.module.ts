import { Module } from '@nestjs/common';
import { HtmlController } from '@modules/html/controllers/html.controller';
import { CreateHtmlService } from '@modules/html/application/create-html.service';
import { FindHtmlService } from '@modules/html/application/find-html.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HtmlRepository } from '@modules/html/infrastructure/database/html.repository';
import { UpdateHtmlService } from '@modules/html/application/update-html.service';

@Module({
  controllers: [HtmlController],
  providers: [CreateHtmlService, FindHtmlService, UpdateHtmlService],
  imports: [TypeOrmModule.forFeature([HtmlRepository])],
})
export class HtmlModule {}

import { Module } from '@nestjs/common';
import { NewsController } from 'src/modules/news/controllers/news.controller';
import { CreateNewsService } from '@modules/news/application/create-news.service';
import { FindNewsService } from '@modules/news/application/find-news.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsRepository } from '@modules/news/infrastructure/database/news.repository';
import { NewsGroupRepository } from '@modules/news/infrastructure/database/news-group.repository';
import { NewsGroupController } from '@modules/news/controllers/news-group.controller';
import { CreateNewsGroupService } from '@modules/news/application/create-news-group.service';
import { FindNewsGroupService } from '@modules/news/application/find-news-group.service';
import { UpdateNewsGroupService } from '@modules/news/application/update-news-group.service';
import { UserRepository } from '@modules/user/infrastructure/database/user.repository';
import { UpdateNewsService } from '@modules/news/application/update-news.service';

@Module({
  controllers: [NewsController, NewsGroupController],
  providers: [
    CreateNewsService,
    FindNewsService,
    CreateNewsGroupService,
    FindNewsGroupService,
    UpdateNewsGroupService,
    UpdateNewsService,
  ],
  imports: [TypeOrmModule.forFeature([NewsRepository, NewsGroupRepository, UserRepository])],
})
export class NewsModule {}

import { Module } from '@nestjs/common';
import { ChapterController } from '@modules/chapter/controllers/chapter.controller';
import { CreateChapterService } from '@modules/chapter/application/create-chapter.service';
import { FindChapterService } from '@modules/chapter/application/find-chapter.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChapterRepository } from '@modules/chapter/infrastructure/database/chapter.repository';
import { UpdateChapterService } from '@modules/chapter/application/update-chapter.service';

@Module({
  controllers: [ChapterController],
  providers: [CreateChapterService, FindChapterService, UpdateChapterService],
  imports: [TypeOrmModule.forFeature([ChapterRepository])],
  exports: [CreateChapterService],
})
export class ChapterModule {}

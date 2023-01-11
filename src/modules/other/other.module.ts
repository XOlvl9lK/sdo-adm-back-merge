import { Module } from '@nestjs/common';
import { LastController } from '@modules/other/controllers/last.controller';
import { FindLastService } from '@modules/other/application/find-last.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsRepository } from '@modules/news/infrastructure/database/news.repository';
import { EducationElementRepository } from '@modules/education-program/infrastructure/database/education-program.repository';
import { MultipleEntitiesController } from '@modules/other/controllers/multiple-entities.controller';
import { FindMultipleEntitiesService } from '@modules/other/application/find-multiple-entities.service';
import { UserRepository } from '@modules/user/infrastructure/database/user.repository';
import { GroupRepository } from '@modules/group/infrastructure/database/group.repository';
import { LibraryFileRepository } from '@modules/library/infrastructure/database/library-file.repository';
import { ArchiveController } from '@modules/other/controllers/archive.controller';
import { ArchiveService } from '@modules/other/application/archive.service';
import { ScormApiController } from '@modules/other/controllers/scorm-api.controller';

@Module({
  controllers: [LastController, MultipleEntitiesController, ArchiveController, ScormApiController],
  providers: [FindLastService, FindMultipleEntitiesService, ArchiveService],
  imports: [
    TypeOrmModule.forFeature([
      NewsRepository,
      EducationElementRepository,
      UserRepository,
      GroupRepository,
      LibraryFileRepository,
    ]),
  ],
})
export class OtherModule {}

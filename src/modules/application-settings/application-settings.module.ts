import { Module } from '@nestjs/common';
import { ApplicationSettingsController } from '@modules/application-settings/controllers/application-settings.controller';
import { FindApplicationSettingsService } from '@modules/application-settings/application/find-application-settings.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationSettingsRepository } from '@modules/application-settings/infrastructure/application-settings.repository';
import { SeedDatabaseService } from '@modules/application-settings/application/seed-database.service';
import { SeedDatabaseController } from '@modules/application-settings/controllers/seed-database.controller';
import { AuthorityModule } from '@modules/authority/authority.module';
import {
  DepartmentRepository,
  RegionRepository, SubdivisionRepository
} from '@modules/authority/infrastructure/database/authority.repository';
import { ChapterRepository } from '@modules/chapter/infrastructure/database/chapter.repository';

@Module({
  controllers: [ApplicationSettingsController, SeedDatabaseController],
  providers: [FindApplicationSettingsService, SeedDatabaseService, SeedDatabaseService],
  imports: [
    TypeOrmModule.forFeature([
      ApplicationSettingsRepository,
      DepartmentRepository,
      RegionRepository,
      SubdivisionRepository,
      ChapterRepository
    ]),
    AuthorityModule
  ],
})
export class ApplicationSettingsModule {}

import { Module } from '@nestjs/common';
import { ProgramSettingsController } from '@modules/program-settings/controllers/program-settings.controller';
import { CreateProgramSettingsService } from '@modules/program-settings/application/create-program-settings.service';
import { FindProgramSettingsService } from '@modules/program-settings/application/find-program-settings.service';
import { UpdateProgramSettingsService } from '@modules/program-settings/application/update-program-settings.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProgramSettingRepository } from '@modules/program-settings/infrastructure/database/program-setting.repository';
import { RoleDibRepository } from '@modules/authority/infrastructure/database/authority.repository';
import { EducationElementRepository } from '@modules/education-program/infrastructure/database/education-program.repository';
import { DeleteProgramSettingsService } from '@modules/program-settings/application/delete-program-settings.service';

@Module({
  controllers: [ProgramSettingsController],
  providers: [
    CreateProgramSettingsService,
    FindProgramSettingsService,
    UpdateProgramSettingsService,
    DeleteProgramSettingsService,
  ],
  imports: [TypeOrmModule.forFeature([ProgramSettingRepository, RoleDibRepository, EducationElementRepository])],
})
export class ProgramSettingsModule {}

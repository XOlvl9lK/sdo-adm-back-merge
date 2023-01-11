import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProgramSettingRepository } from '@modules/program-settings/infrastructure/database/program-setting.repository';
import { RoleDibRepository } from '@modules/authority/infrastructure/database/authority.repository';
import { CreateProgramSettingsDto } from '@modules/program-settings/controllers/dtos/create-program-settings.dto';
import { ProgramSettingsEntity } from '@modules/program-settings/domain/program-settings.entity';
import { AuthorityException } from '@modules/authority/infrastructure/exceptions/authority.exception';
import {
  ProgramSettingsException
} from '@modules/program-settings/infrastructure/exceptions/program-settings.exception';

@Injectable()
export class CreateProgramSettingsService {
  constructor(
    @InjectRepository(ProgramSettingRepository)
    private programSettingsRepository: ProgramSettingRepository,
    @InjectRepository(RoleDibRepository)
    private roleDibRepository: RoleDibRepository,
  ) {}

  async create({ roleId }: CreateProgramSettingsDto) {
    if (await this.programSettingsRepository.roleAlreadyHasSettings(roleId)) ProgramSettingsException.AlreadyHasSettings()
    const roleDib = await this.roleDibRepository.findById(roleId);
    if (!roleDib) AuthorityException.NotFound('Роль ДИБ');
    const programSettings = new ProgramSettingsEntity(roleDib);
    return await this.programSettingsRepository.save(programSettings);
  }
}

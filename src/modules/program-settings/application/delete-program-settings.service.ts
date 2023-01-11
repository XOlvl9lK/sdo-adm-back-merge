import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProgramSettingRepository } from '@modules/program-settings/infrastructure/database/program-setting.repository';
import { DeleteProgramSettingsDto } from '@modules/program-settings/controllers/dtos/delete-program-settings.dto';

@Injectable()
export class DeleteProgramSettingsService {
  constructor(
    @InjectRepository(ProgramSettingRepository)
    private programSettingsRepository: ProgramSettingRepository,
  ) {}

  async deleteMany({ programSettingsIds }: DeleteProgramSettingsDto) {
    const programSettings = await this.programSettingsRepository.findByIds(programSettingsIds);
    return await this.programSettingsRepository.remove(programSettings);
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProgramSettingRepository } from '@modules/program-settings/infrastructure/database/program-setting.repository';
import { RequestQuery } from '@core/libs/types';

@Injectable()
export class FindProgramSettingsService {
  constructor(
    @InjectRepository(ProgramSettingRepository)
    private programSettingsRepository: ProgramSettingRepository,
  ) {}

  async findAll(requestQuery: RequestQuery) {
    return await this.programSettingsRepository.findAll(requestQuery);
  }

  async findById(id: string) {
    return await this.programSettingsRepository.findById(id);
  }
}

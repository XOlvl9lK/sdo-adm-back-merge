import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApplicationSettingsRepository } from '@modules/application-settings/infrastructure/application-settings.repository';

@Injectable()
export class FindApplicationSettingsService {
  constructor(
    @InjectRepository(ApplicationSettingsRepository)
    private applicationSettingsRepository: ApplicationSettingsRepository,
  ) {}

  async findByTitle(titles: string[]) {
    return await this.applicationSettingsRepository.findByTitles(titles);
  }
}

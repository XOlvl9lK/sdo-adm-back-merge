import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EducationProgramSettingsRepository } from '@modules/education-program/infrastructure/database/education-program-settings.repository';

@Injectable()
export class FindEducationProgramSettingsService {
  constructor(
    @InjectRepository(EducationProgramSettingsRepository)
    private educationProgramSettingsRepository: EducationProgramSettingsRepository,
  ) {}

  async findById(id: string) {
    return await this.educationProgramSettingsRepository.findById(id);
  }
}

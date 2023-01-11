import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EducationProgramSettingsRepository } from '@modules/education-program/infrastructure/database/education-program-settings.repository';
import { EducationProgramSettingsEntity } from '@modules/education-program/domain/education-program-settings.entity';
import { MixingTypeEnum } from '@modules/education-program/domain/test-settings.entity';

@Injectable()
export class CreateEducationProgramSettingsService {
  constructor(
    @InjectRepository(EducationProgramSettingsRepository)
    private educationProgramSettingsRepository: EducationProgramSettingsRepository,
  ) {}

  async create({
    orderOfStudy,
    startDate,
    endDate,
    isObligatory
  }: {
    orderOfStudy?: MixingTypeEnum;
    startDate?: string;
    endDate?: string;
    isObligatory?: boolean
  }) {
    const educationProgramSettings = new EducationProgramSettingsEntity(orderOfStudy, startDate, endDate, isObligatory);
    return await this.educationProgramSettingsRepository.save(educationProgramSettings);
  }
}

import { EntityRepository } from 'typeorm';
import { EducationProgramSettingsEntity } from '@modules/education-program/domain/education-program-settings.entity';
import { BaseRepository } from '@core/database/base.repository';

@EntityRepository(EducationProgramSettingsEntity)
export class EducationProgramSettingsRepository extends BaseRepository<EducationProgramSettingsEntity> {}

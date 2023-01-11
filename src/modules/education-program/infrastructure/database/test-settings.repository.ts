import { EntityRepository } from 'typeorm';
import { TestSettingsEntity } from '@modules/education-program/domain/test-settings.entity';
import { BaseRepository } from '@core/database/base.repository';

@EntityRepository(TestSettingsEntity)
export class TestSettingsRepository extends BaseRepository<TestSettingsEntity> {}

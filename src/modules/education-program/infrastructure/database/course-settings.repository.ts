import { EntityRepository } from 'typeorm';
import { CourseSettingsEntity } from '@modules/education-program/domain/course-settings.entity';
import { BaseRepository } from '@core/database/base.repository';

@EntityRepository(CourseSettingsEntity)
export class CourseSettingsRepository extends BaseRepository<CourseSettingsEntity> {}

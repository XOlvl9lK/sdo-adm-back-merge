import { EntityRepository } from 'typeorm';
import { CourseSuspendDataEntity } from '@modules/course/domain/course-suspend-data.entity';
import { BaseRepository } from '@core/database/base.repository';

@EntityRepository(CourseSuspendDataEntity)
export class CourseSuspendDataRepository extends BaseRepository<CourseSuspendDataEntity> {
  findByAttemptId(attemptId: string) {
    return this.findOne({
      where: {
        attemptId,
      },
    });
  }
}

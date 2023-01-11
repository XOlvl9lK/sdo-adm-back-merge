import { mockBaseEntity } from '@core/domain/base.entity.mock';
import { Random } from '@core/test/random';
import { plainToInstance } from 'class-transformer';
import { CourseSuspendDataEntity } from '@modules/course/domain/course-suspend-data.entity';

const mockCourseSuspendData = {
  ...mockBaseEntity,
  lessonStatus: Random.lorem,
  lessonLocation: Random.lorem,
  suspendData: Random.lorem,
  userId: Random.id,
  attemptId: Random.id,
};

export const mockCourseSuspendDataInstance = plainToInstance(CourseSuspendDataEntity, mockCourseSuspendData);

describe('CourseSuspendDataEntity', () => {
  test('Should update', () => {
    mockCourseSuspendDataInstance.update('Status', 'Location', 'SuspendData');

    expect(mockCourseSuspendDataInstance.lessonStatus).toBe('Status');
    expect(mockCourseSuspendDataInstance.lessonLocation).toBe('Location');
    expect(mockCourseSuspendDataInstance.suspendData).toBe('SuspendData');
  });
});

import { Random } from '@core/test/random';
import { mockBaseEntity } from '@core/domain/base.entity.mock';
import { plainToInstance } from 'class-transformer';
import { CourseSettingsEntity } from '@modules/education-program/domain/course-settings.entity';

const mockCourseSettings = {
  ...mockBaseEntity,
  timeLimit: 20,
  numberOfAttempts: 5,
  isObligatory: true,
  startDate: Random.datePast,
  endDate: Random.dateFuture,
};

export const mockCourseSettingsInstance = plainToInstance(CourseSettingsEntity, mockCourseSettings);

describe('CourseSettingsEntity', () => {
  test('Should update', () => {
    mockCourseSettingsInstance.update(50, 7, false);

    expect(mockCourseSettingsInstance.timeLimit).toBe(50);
    expect(mockCourseSettingsInstance.numberOfAttempts).toBe(7);
    expect(mockCourseSettingsInstance.isObligatory).toBe(false);
  });

  test('Should return is time is over', () => {
    const result = mockCourseSettingsInstance.isTimeIsOver();

    expect(result).toBe(false);
  });
});

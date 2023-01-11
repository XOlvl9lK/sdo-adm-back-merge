import { mockBaseEntity } from '@core/domain/base.entity.mock';
import { Random } from '@core/test/random';
import { plainToInstance } from 'class-transformer';
import { CourseEntity } from '@modules/course/domain/course.entity';
import { mockChapterInstance } from '@modules/chapter/domain/chapter.entity.spec';

const mockCourse = {
  ...mockBaseEntity,
  title: Random.lorem,
  description: Random.lorem,
  duration: Random.number,
};

export const mockCourseInstance = plainToInstance(CourseEntity, mockCourse);

describe('CourseEntity', () => {
  test('Should update course', () => {
    mockCourseInstance.update('Title', 40, false, false, mockChapterInstance, 'Description');

    expect(mockCourseInstance.title).toBe('Title');
    expect(mockCourseInstance.duration).toBe(40);
    expect(mockCourseInstance.isSelfAssignmentAvailable).toBe(false);
    expect(mockCourseInstance.available).toBe(false);
    expect(mockCourseInstance.description).toBe('Description');

    mockCourseInstance.title = Random.lorem;
    mockCourseInstance.duration = Random.number;
    mockCourseInstance.isSelfAssignmentAvailable = true;
    mockCourseInstance.available = true;
    mockCourseInstance.description = Random.lorem;
  });
});

import { courseSettingsRepositoryMockProvider, TestHelper } from '@core/test/test.helper';
import { FindCourseSettingsService } from '@modules/education-program/application/find-course-settings.service';
import { Random } from '@core/test/random';
import { mockCourseSettingsInstance } from '@modules/education-program/domain/course-settings.entity.spec';

const helpers = new TestHelper(courseSettingsRepositoryMockProvider);

describe('FindCourseSettingsService', () => {
  let findCourseSettingsService: FindCourseSettingsService;

  beforeAll(async () => {
    [findCourseSettingsService] = await helpers.beforeAll([FindCourseSettingsService]);
  });

  test('Should return course settings by id', async () => {
    const result = await findCourseSettingsService.findById(Random.id);

    expect(result).toEqual(mockCourseSettingsInstance);
  });
});

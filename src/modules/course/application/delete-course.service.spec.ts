import { courseRepositoryMockProvider, TestHelper } from '@core/test/test.helper';
import { DeleteCourseService } from '@modules/course/application/delete-course.service';
import { Random } from '@core/test/random';
import { mockCourseInstance } from '@modules/course/domain/course.entity.spec';

const helpers = new TestHelper(courseRepositoryMockProvider);

describe('DeleteCourseService', () => {
  let deleteCourseService: DeleteCourseService;

  beforeAll(async () => {
    [deleteCourseService] = await helpers.beforeAll([DeleteCourseService]);
  });

  test('Should delete course', async () => {
    await deleteCourseService.delete(Random.id);

    const mockCourseRepository = helpers.getProviderValueByToken('CourseRepository');

    expect(mockCourseRepository.remove).toHaveBeenCalledTimes(1);
    expect(mockCourseRepository.remove).toHaveBeenCalledWith(mockCourseInstance);
  });
});

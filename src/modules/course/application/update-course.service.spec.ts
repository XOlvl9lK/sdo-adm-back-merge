import { chapterRepositoryMockProvider, courseRepositoryMockProvider, TestHelper } from '@core/test/test.helper';
import { UpdateCourseService } from '@modules/course/application/update-course.service';
import { Random } from '@core/test/random';
import { EventActionEnum } from '@modules/event/application/create-event.service';
import { UpdateEntityEvent } from '@modules/event/infrastructure/events/update-entity.event';
import { mockCourseInstance } from '@modules/course/domain/course.entity.spec';

const helpers = new TestHelper(courseRepositoryMockProvider, chapterRepositoryMockProvider);

describe('UpdateCourseService', () => {
  let updateCourseService: UpdateCourseService;

  beforeAll(async () => {
    [updateCourseService] = await helpers.beforeAll([UpdateCourseService]);
  });

  test('Should update course and emit', async () => {
    await updateCourseService.update(
      {
        id: Random.id,
        description: Random.lorem,
        available: Random.boolean,
        duration: Random.number,
        title: Random.lorem,
        selfAssignment: Random.boolean,
        chapterId: Random.id,
      },
      Random.id,
    );

    const mockCourseRepository = helpers.getProviderValueByToken('CourseRepository');
    const mockEventEmitter = helpers.getProviderValueByToken('EventEmitter2');

    expect(mockEventEmitter.emit).toHaveBeenCalledTimes(1);
    expect(mockEventEmitter.emit).toHaveBeenCalledWith(
      EventActionEnum.UPDATE_ENTITY,
      new UpdateEntityEvent('курс', Random.id, 'Курсы дистанционного обучения', mockCourseInstance),
    );
    expect(mockCourseRepository.save).toHaveBeenCalledTimes(1);
    expect(mockCourseRepository.save).toHaveBeenCalledWith(mockCourseInstance);
  });
});

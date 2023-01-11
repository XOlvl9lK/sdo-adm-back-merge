import {
  assignmentRepositoryMockProvider,
  courseSettingsRepositoryMockProvider,
  TestHelper,
} from '@core/test/test.helper';
import { UpdateCourseSettingsService } from '@modules/education-program/application/update-course-settings.service';
import { Random } from '@core/test/random';
import { EventActionEnum } from '@modules/event/application/create-event.service';
import { UpdateEntityEvent } from '@modules/event/infrastructure/events/update-entity.event';
import { mockCourseSettingsInstance } from '@modules/education-program/domain/course-settings.entity.spec';
import { mockTestAssignmentInstance } from '@modules/education-request/domain/assignment.entity.spec';

const helpers = new TestHelper(courseSettingsRepositoryMockProvider, assignmentRepositoryMockProvider);

describe('UpdateCourseSettingsService', () => {
  let updateCourseSettingsService: UpdateCourseSettingsService;

  beforeAll(async () => {
    [updateCourseSettingsService] = await helpers.beforeAll([UpdateCourseSettingsService]);
  });

  test('Should update course settings', async () => {
    await updateCourseSettingsService.update(
      {
        id: Random.id,
        assignmentId: Random.id,
        numberOfAttempts: 20,
        startDate: Random.datePast.toISOString(),
        isObligatory: true,
      },
      Random.id,
    );

    const mockEventEmitter = helpers.getProviderValueByToken('EventEmitter2');
    const mockCourseSettingsRepository = helpers.getProviderValueByToken('CourseSettingsRepository');
    const mockAssignmentRepository = helpers.getProviderValueByToken('AssignmentRepository');

    expect(mockEventEmitter.emit).toHaveBeenCalledTimes(1);
    expect(mockEventEmitter.emit).toHaveBeenCalledWith(
      EventActionEnum.UPDATE_ENTITY,
      new UpdateEntityEvent('настройки курса', Random.id, 'Программы обучения', mockCourseSettingsInstance),
    );
    expect(mockAssignmentRepository.save).toHaveBeenCalledTimes(1);
    expect(mockAssignmentRepository.save).toHaveBeenCalledWith(mockTestAssignmentInstance);
    expect(mockCourseSettingsRepository.save).toHaveBeenCalledTimes(1);
    expect(mockCourseSettingsRepository.save).toHaveBeenCalledWith(mockCourseSettingsInstance);
  });
});

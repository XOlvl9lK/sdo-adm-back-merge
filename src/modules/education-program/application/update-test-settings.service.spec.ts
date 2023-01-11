import {
  assignmentRepositoryMockProvider,
  TestHelper,
  testSettingsRepositoryMockProvider,
} from '@core/test/test.helper';
import { UpdateTestSettingsService } from '@modules/education-program/application/update-test-settings.service';
import { Random } from '@core/test/random';
import { QuestionDeliveryFormatEnum } from '@modules/education-program/domain/test-settings.entity';
import { EventActionEnum } from '@modules/event/application/create-event.service';
import { UpdateEntityEvent } from '@modules/event/infrastructure/events/update-entity.event';
import { mockTestAssignmentInstance } from '@modules/education-request/domain/assignment.entity.spec';
import { mockTestSettingsInstance } from '@modules/education-program/domain/test-settings.entity.spec';

const helpers = new TestHelper(testSettingsRepositoryMockProvider, assignmentRepositoryMockProvider);

describe('UpdateTestSettingsService', () => {
  let updateTestSettingsService: UpdateTestSettingsService;

  beforeAll(async () => {
    [updateTestSettingsService] = await helpers.beforeAll([UpdateTestSettingsService]);
  });

  test('Should update test settings and emit', async () => {
    await updateTestSettingsService.update(
      {
        id: Random.id,
        assignmentId: Random.id,
        questionDeliveryFormat: QuestionDeliveryFormatEnum.LIMIT,
        passingScore: 123,
        numberOfAttempts: 123,
      },
      Random.id,
    );

    const mockEventEmitter = helpers.getProviderValueByToken('EventEmitter2');
    const mockTestSettingsRepository = helpers.getProviderValueByToken('TestSettingsRepository');
    const mockAssignmentRepository = helpers.getProviderValueByToken('AssignmentRepository');

    expect(mockEventEmitter.emit).toHaveBeenCalledTimes(1);
    expect(mockEventEmitter.emit).toHaveBeenCalledWith(
      EventActionEnum.UPDATE_ENTITY,
      new UpdateEntityEvent('настройки теста', Random.id, 'Программы обучения', mockTestSettingsInstance),
    );
    expect(mockAssignmentRepository.save).toHaveBeenCalledTimes(1);
    expect(mockAssignmentRepository.save).toHaveBeenCalledWith(mockTestAssignmentInstance);
    expect(mockTestSettingsRepository.save).toHaveBeenCalledTimes(1);
    expect(mockTestSettingsRepository.save).toHaveBeenCalledWith(mockTestSettingsInstance);
  });
});

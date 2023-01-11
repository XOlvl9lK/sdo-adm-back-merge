import {
  assignmentRepositoryMockProvider,
  educationProgramSettingsRepositoryMockProvider,
  TestHelper,
} from '@core/test/test.helper';
import { UpdateEducationProgramSettingsService } from '@modules/education-program/application/update-education-program-settings.service';
import { Random } from '@core/test/random';
import { MixingTypeEnum } from '@modules/education-program/domain/test-settings.entity';
import { EventActionEnum } from '@modules/event/application/create-event.service';
import { UpdateEntityEvent } from '@modules/event/infrastructure/events/update-entity.event';
import { mockEducationProgramSettingsInstance } from '@modules/education-program/domain/education-program-settings.entity.spec';
import { mockTestAssignmentInstance } from '@modules/education-request/domain/assignment.entity.spec';

const helpers = new TestHelper(educationProgramSettingsRepositoryMockProvider, assignmentRepositoryMockProvider);

describe('UpdateEducationProgramSettingsService', () => {
  let updateEducationProgramSettingsService: UpdateEducationProgramSettingsService;

  beforeAll(async () => {
    [updateEducationProgramSettingsService] = await helpers.beforeAll([UpdateEducationProgramSettingsService]);
  });

  test('Should update education program settings and emit', async () => {
    await updateEducationProgramSettingsService.update(
      {
        id: Random.id,
        assignmentId: Random.id,
        orderOfStudy: MixingTypeEnum.ORIGINAL,
        endDate: Random.datePast.toISOString(),
      },
      Random.id,
    );

    const mockEventEmitter = helpers.getProviderValueByToken('EventEmitter2');
    const mockEducationProgramSettingsRepository = helpers.getProviderValueByToken(
      'EducationProgramSettingsRepository',
    );
    const mockAssignmentRepository = helpers.getProviderValueByToken('AssignmentRepository');

    expect(mockEventEmitter.emit).toHaveBeenCalledTimes(1);
    expect(mockEventEmitter.emit).toHaveBeenCalledWith(
      EventActionEnum.UPDATE_ENTITY,
      new UpdateEntityEvent(
        'настройки программы обучения',
        Random.id,
        'Зачисления',
        mockEducationProgramSettingsInstance,
      ),
    );
    expect(mockAssignmentRepository.save).toHaveBeenCalledTimes(1);
    expect(mockAssignmentRepository.save).toHaveBeenCalledWith(mockTestAssignmentInstance);
    expect(mockEducationProgramSettingsRepository.save).toHaveBeenCalledTimes(1);
    expect(mockEducationProgramSettingsRepository.save).toHaveBeenCalledWith(mockEducationProgramSettingsInstance);
  });
});

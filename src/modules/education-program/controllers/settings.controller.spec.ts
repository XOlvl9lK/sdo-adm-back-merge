import { TestHelper } from '@core/test/test.helper';
import { FindTestSettingsService } from '@modules/education-program/application/find-test-settings.service';
import { mockTestSettingsInstance } from '@modules/education-program/domain/test-settings.entity.spec';
import { UpdateTestSettingsService } from '@modules/education-program/application/update-test-settings.service';
import { UpdateCourseSettingsService } from '@modules/education-program/application/update-course-settings.service';
import { FindCourseSettingsService } from '@modules/education-program/application/find-course-settings.service';
import { mockCourseSettingsInstance } from '@modules/education-program/domain/course-settings.entity.spec';
import { FindEducationProgramSettingsService } from '@modules/education-program/application/find-education-program-settings.service';
import { mockEducationProgramSettingsInstance } from '@modules/education-program/domain/education-program-settings.entity.spec';
import { UpdateEducationProgramSettingsService } from '@modules/education-program/application/update-education-program-settings.service';
import { SettingsController } from '@modules/education-program/controllers/settings.controller';
import { Random } from '@core/test/random';
import { MixingTypeEnum } from '@modules/education-program/domain/test-settings.entity';

const helpers = new TestHelper(
  {
    type: 'findService',
    provide: FindTestSettingsService,
    mockValue: mockTestSettingsInstance,
  },
  { type: 'updateService', provide: UpdateTestSettingsService },
  { type: 'updateService', provide: UpdateCourseSettingsService },
  {
    type: 'findService',
    provide: FindCourseSettingsService,
    mockValue: mockCourseSettingsInstance,
  },
  {
    type: 'findService',
    provide: FindEducationProgramSettingsService,
    mockValue: mockEducationProgramSettingsInstance,
  },
  { type: 'updateService', provide: UpdateEducationProgramSettingsService },
);

describe('SettingsController', () => {
  let settingsController: SettingsController;

  beforeAll(async () => {
    [settingsController] = await helpers.beforeAll([SettingsController], [], [SettingsController]);
  });

  test('Should return test settings by id', async () => {
    const result = await settingsController.getTestSettingsById(Random.id);

    expect(result).toEqual(mockTestSettingsInstance);
  });

  test('Should return course settings by id', async () => {
    const result = await settingsController.getCourseSettingsById(Random.id);

    expect(result).toEqual(mockCourseSettingsInstance);
  });

  test('Should return education program settings by id', async () => {
    const result = await settingsController.getEducationProgramSettingsById(Random.id);

    expect(result).toEqual(mockEducationProgramSettingsInstance);
  });

  test('Should call update', async () => {
    await settingsController.updateTestSettings(
      {
        id: Random.id,
        assignmentId: Random.id,
      },
      Random.id,
    );

    const mockUpdateTestSettingsService = helpers.getProviderValueByToken('UpdateTestSettingsService');

    expect(mockUpdateTestSettingsService.update).toHaveBeenCalledTimes(1);
    expect(mockUpdateTestSettingsService.update).toHaveBeenCalledWith(
      {
        id: Random.id,
        assignmentId: Random.id,
      },
      Random.id,
    );
  });

  test('Should call update', async () => {
    await settingsController.updateCourseSettings(
      {
        id: Random.id,
        assignmentId: Random.id,
      },
      Random.id,
    );

    const mockUpdateCourseSettingsService = helpers.getProviderValueByToken('UpdateCourseSettingsService');

    expect(mockUpdateCourseSettingsService.update).toHaveBeenCalledTimes(1);
    expect(mockUpdateCourseSettingsService.update).toHaveBeenCalledWith(
      {
        id: Random.id,
        assignmentId: Random.id,
      },
      Random.id,
    );
  });

  test('Should call update', async () => {
    await settingsController.updateEducationProgramSettings(
      {
        id: Random.id,
        assignmentId: Random.id,
        orderOfStudy: MixingTypeEnum.ORIGINAL,
      },
      Random.id,
    );

    const mockUpdateEducationProgramSettingsService = helpers.getProviderValueByToken(
      'UpdateEducationProgramSettingsService',
    );

    expect(mockUpdateEducationProgramSettingsService.update).toHaveBeenCalledTimes(1);
    expect(mockUpdateEducationProgramSettingsService.update).toHaveBeenCalledWith(
      {
        id: Random.id,
        assignmentId: Random.id,
        orderOfStudy: MixingTypeEnum.ORIGINAL,
      },
      Random.id,
    );
  });
});

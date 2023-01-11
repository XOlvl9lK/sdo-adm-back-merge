import { courseSettingsRepositoryMockProvider, TestHelper } from '@core/test/test.helper';
import { CreateCourseSettingsService } from '@modules/education-program/application/create-course-settings.service';
import { Random } from '@core/test/random';
import { CourseSettingsEntity } from '@modules/education-program/domain/course-settings.entity';
import { mockCourseSettingsInstance } from '@modules/education-program/domain/course-settings.entity.spec';
jest.mock('@modules/education-program/domain/course-settings.entity');
//@ts-ignore
CourseSettingsEntity.mockImplementation(() => mockCourseSettingsInstance);

const helpers = new TestHelper(courseSettingsRepositoryMockProvider);

describe('CreateCourseSettingsService', () => {
  let createCourseSettingsService: CreateCourseSettingsService;

  beforeAll(async () => {
    [createCourseSettingsService] = await helpers.beforeAll([CreateCourseSettingsService]);
  });

  test('Should create course settings', async () => {
    await createCourseSettingsService.create({
      timeLimit: 20,
      endDate: Random.dateFuture.toISOString(),
      certificateIssuance: true,
      isObligatory: true,
      numberOfAttempts: 5,
      startDate: Random.datePast.toISOString(),
    });

    const mockCourseSettingsRepository = helpers.getProviderValueByToken('CourseSettingsRepository');

    expect(mockCourseSettingsRepository.save).toHaveBeenCalledTimes(1);
    expect(mockCourseSettingsRepository.save).toHaveBeenCalledWith(mockCourseSettingsInstance);
  });
});

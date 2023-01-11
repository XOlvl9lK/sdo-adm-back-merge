import {
  courseRepositoryMockProvider,
  TestHelper,
  userEducationRequestRepositoryMockProvider,
} from '@core/test/test.helper';
import { FindCourseService } from '@modules/course/application/find-course.service';
import { mockCourseInstance } from '@modules/course/domain/course.entity.spec';
import { Random } from '@core/test/random';
import { ScormCourseService } from '@modules/course/infrastructure/scorm-course.service';
import { EducationRequestStatusEnum } from '@modules/education-request/domain/education-request.entity';

const helpers = new TestHelper(courseRepositoryMockProvider, userEducationRequestRepositoryMockProvider);

describe('FindCourseService', () => {
  let findCourseService: FindCourseService;

  beforeAll(async () => {
    [findCourseService] = await helpers.beforeAll(
      [FindCourseService],
      [
        {
          provide: ScormCourseService,
          useValue: {
            getScormPathById: jest.fn().mockResolvedValue(Random.lorem),
          },
        },
      ],
    );
  });

  test('Should return all courses and count', async () => {
    const result = await findCourseService.findAll({});

    expect(result).toEqual([[mockCourseInstance], Random.number]);
  });

  test('Should return course by id', async () => {
    const result = await findCourseService.findById(Random.id, Random.id);

    expect(result).toEqual({
      ...mockCourseInstance,
      requestStatuses: [EducationRequestStatusEnum.ACCEPTED],
      filepath: Random.lorem,
    });
  });
});

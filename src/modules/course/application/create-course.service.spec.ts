import {
  chapterRepositoryMockProvider,
  courseRepositoryMockProvider,
  educationProgramRepositoryMockProvider,
  TestHelper,
} from '@core/test/test.helper';
import { CreateCourseService } from '@modules/course/application/create-course.service';
import { AttachScormCourseService } from '@modules/course/application/attach-scorm-course.service';
import { Random } from '@core/test/random';
import { Buffer } from 'buffer';
import { CreateEntityEvent } from '@modules/event/infrastructure/events/create-entity.event';
import { EventActionEnum } from '@modules/event/application/create-event.service';
import { mockCourseInstance } from '@modules/course/domain/course.entity.spec';
import { CourseEntity } from '@modules/course/domain/course.entity';
jest.mock('@modules/course/domain/course.entity');
//@ts-ignore
CourseEntity.mockImplementation(() => mockCourseInstance);

const helpers = new TestHelper(
  courseRepositoryMockProvider,
  educationProgramRepositoryMockProvider,
  chapterRepositoryMockProvider,
);

describe('CreateCourseService', () => {
  let createCourseService: CreateCourseService;

  beforeAll(async () => {
    [createCourseService] = await helpers.beforeAll(
      [CreateCourseService],
      [
        {
          provide: AttachScormCourseService,
          useValue: {
            attachScormCourse: jest.fn(),
          },
        },
      ],
    );
  });

  test('Should create course', async () => {
    await createCourseService.create(
      {
        title: Random.lorem,
        available: Random.boolean,
        description: Random.lorem,
        chapterId: Random.id,
        duration: Random.number,
        selfAssignment: Random.boolean,
      },
      Random.id,
      { buffer: Buffer.from('') } as any as Express.Multer.File,
    );

    const mockEventEmitter = helpers.getProviderValueByToken('EventEmitter2');
    const mockCourseRepository = helpers.getProviderValueByToken('CourseRepository');

    expect(mockEventEmitter.emit).toHaveBeenCalledTimes(1);
    expect(mockEventEmitter.emit).toHaveBeenCalledWith(
      EventActionEnum.CREATE_ENTITY,
      new CreateEntityEvent('курс', Random.id, Random.id, 'Курсы дистанционного обучения'),
    );
    expect(mockCourseRepository.save).toHaveBeenCalledTimes(1);
    expect(mockCourseRepository.save).toHaveBeenCalledWith(mockCourseInstance);
  });
});

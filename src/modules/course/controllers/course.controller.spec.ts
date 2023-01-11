import { TestHelper } from '@core/test/test.helper';
import { CreateCourseService } from '@modules/course/application/create-course.service';
import { FindCourseService } from '@modules/course/application/find-course.service';
import { mockCourseInstance } from '@modules/course/domain/course.entity.spec';
import { DeleteCourseService } from '@modules/course/application/delete-course.service';
import { UpdateCourseService } from '@modules/course/application/update-course.service';
import { CourseController } from '@modules/course/controllers/course.controller';
import { AttachScormCourseService } from '@modules/course/application/attach-scorm-course.service';
import { SubmitCourseService } from '@modules/course/application/submit-course.service';
import { RunCourseService } from '@modules/course/application/run-course.service';
import { Random } from '@core/test/random';

const helpers = new TestHelper(
  { type: 'createService', provide: CreateCourseService },
  {
    type: 'findService',
    provide: FindCourseService,
    mockValue: mockCourseInstance,
  },
  { type: 'deleteService', provide: DeleteCourseService },
  { type: 'updateService', provide: UpdateCourseService },
);

describe('CourseController', () => {
  let courseController: CourseController;

  beforeAll(async () => {
    [courseController] = await helpers.beforeAll(
      [CourseController],
      [
        {
          provide: AttachScormCourseService,
          useValue: {
            attachScormCourse: jest.fn(),
          },
        },
        {
          provide: SubmitCourseService,
          useValue: {
            submit: jest.fn(),
          },
        },
        {
          provide: RunCourseService,
          useValue: {
            runCourseAttempt: jest.fn(),
          },
        },
      ],
      [CourseController],
    );
  });

  test('Should return all courses and count', async () => {
    const result = await courseController.getAll({});

    expect(result).toEqual({
      total: Random.number,
      data: [mockCourseInstance],
    });
  });

  test('Should return course by id', async () => {
    const result = await courseController.getById(Random.id, Random.id);

    expect(result).toEqual(mockCourseInstance);
  });

  test('Should call create', async () => {
    await courseController.create(
      {
        selfAssignment: true,
        duration: 5,
        chapterId: Random.id,
        description: Random.lorem,
        available: Random.boolean,
        title: Random.lorem,
      },
      { buffer: Buffer.from('') } as any as Express.Multer.File,
      Random.id,
    );

    const mockCreateCourseService = helpers.getProviderValueByToken('CreateCourseService');

    expect(mockCreateCourseService.create).toHaveBeenCalledTimes(1);
    expect(mockCreateCourseService.create).toHaveBeenCalledWith(
      {
        selfAssignment: true,
        duration: 5,
        chapterId: Random.id,
        description: Random.lorem,
        available: Random.boolean,
        title: Random.lorem,
      },
      Random.id,
      { buffer: Buffer.from('') },
    );
  });

  test('Should call attachScormCourse', async () => {
    await courseController.attachScorm(Random.id, {
      buffer: Buffer.from(''),
    } as any as Express.Multer.File);

    const mockAttachScormCourseService = helpers.getProviderValueByToken('AttachScormCourseService');

    expect(mockAttachScormCourseService.attachScormCourse).toHaveBeenCalledTimes(1);
    expect(mockAttachScormCourseService.attachScormCourse).toHaveBeenCalledWith(Random.id, Buffer.from(''));
  });

  test('Should call submit', async () => {
    await courseController.submit(Random.id, Random.id);

    const mockSubmitCourseService = helpers.getProviderValueByToken('SubmitCourseService');

    expect(mockSubmitCourseService.submit).toHaveBeenCalledTimes(1);
    expect(mockSubmitCourseService.submit).toHaveBeenCalledWith(Random.id, Random.id);
  });

  test('Should call runCourseAttempt', async () => {
    await courseController.runCourseAttempt({
      userId: Random.id,
      courseId: Random.id,
      performanceId: Random.id,
    });

    const mockRunCourseService = helpers.getProviderValueByToken('RunCourseService');

    expect(mockRunCourseService.runCourseAttempt).toHaveBeenCalledTimes(1);
    expect(mockRunCourseService.runCourseAttempt).toHaveBeenCalledWith({
      userId: Random.id,
      courseId: Random.id,
      performanceId: Random.id,
    });
  });

  test('Should call update', async () => {
    await courseController.update(
      {
        id: Random.id,
        chapterId: Random.id,
        title: Random.lorem,
        available: Random.boolean,
        selfAssignment: Random.boolean,
        duration: Random.number,
        description: Random.lorem,
      },
      Random.id,
    );

    const mockUpdateCourseService = helpers.getProviderValueByToken('UpdateCourseService');

    expect(mockUpdateCourseService.update).toHaveBeenCalledTimes(1);
    expect(mockUpdateCourseService.update).toHaveBeenCalledWith(
      {
        id: Random.id,
        chapterId: Random.id,
        title: Random.lorem,
        available: Random.boolean,
        selfAssignment: Random.boolean,
        duration: Random.number,
        description: Random.lorem,
      },
      Random.id,
    );
  });

  test('Should call delete', async () => {
    await courseController.delete(Random.id);

    const mockDeleteCourseService = helpers.getProviderValueByToken('DeleteCourseService');

    expect(mockDeleteCourseService.delete).toHaveBeenCalledTimes(1);
    expect(mockDeleteCourseService.delete).toHaveBeenCalledWith(Random.id);
  });
});

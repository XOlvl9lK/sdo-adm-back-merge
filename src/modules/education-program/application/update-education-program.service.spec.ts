import {
  chapterRepositoryMockProvider,
  educationProgramRepositoryMockProvider,
  programElementRepositoryMockProvider,
  TestHelper,
} from '@core/test/test.helper';
import { CreateProgramElementService } from '@modules/education-program/application/create-program-element.service';
import {
  mockEducationProgramInstance,
  mockTestProgramElementInstance,
} from '@modules/education-program/domain/education-program.entity.spec';
import { UpdateEducationProgramService } from '@modules/education-program/application/update-education-program.service';
import { Random } from '@core/test/random';
import { EventActionEnum } from '@modules/event/application/create-event.service';
import { UpdateEntityEvent } from '@modules/event/infrastructure/events/update-entity.event';
import { ChapterModeEnum } from '@modules/course/controllers/dtos/create-course.dto';

const helpers = new TestHelper(
  educationProgramRepositoryMockProvider,
  chapterRepositoryMockProvider,
  programElementRepositoryMockProvider,
  {
    type: 'createService',
    provide: CreateProgramElementService,
    extend: [{ method: 'create', mockImplementation: jest.fn().mockResolvedValue(mockTestProgramElementInstance) }],
  },
);

describe('UpdateEducationProgramService', () => {
  let updateEducationProgramService: UpdateEducationProgramService;

  beforeAll(async () => {
    [updateEducationProgramService] = await helpers.beforeAll([UpdateEducationProgramService]);
  });

  test('Should update education program and emit', async () => {
    await updateEducationProgramService.update(
      {
        id: Random.id,
        description: Random.lorem,
        chapterId: Random.id,
        educationElementIds: [Random.id],
        title: Random.lorem,
        available: true,
        selfEnrollmentAllowed: true,
        sectionMode: ChapterModeEnum.CREATE,
      },
      Random.id,
    );

    const mockEventEmitter = helpers.getProviderValueByToken('EventEmitter2');
    const mockEducationProgramRepository = helpers.getProviderValueByToken('EducationProgramRepository');

    expect(mockEventEmitter.emit).toHaveBeenCalledTimes(1);
    expect(mockEventEmitter.emit).toHaveBeenCalledWith(
      EventActionEnum.UPDATE_ENTITY,
      new UpdateEntityEvent('программу обучения', Random.id, 'Программы обучения', mockEducationProgramInstance),
    );
    expect(mockEducationProgramRepository.save).toHaveBeenCalledTimes(1);
    expect(mockEducationProgramRepository.save).toHaveBeenCalledWith(mockEducationProgramInstance);
  });
});

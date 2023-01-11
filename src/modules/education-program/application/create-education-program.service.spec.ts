import {
  chapterRepositoryMockProvider,
  educationElementRepositoryMockProvider,
  educationProgramRepositoryMockProvider,
  TestHelper,
} from '@core/test/test.helper';
import { CreateProgramElementService } from '@modules/education-program/application/create-program-element.service';
import {
  mockEducationProgramInstance,
  mockTestProgramElementInstance,
} from '@modules/education-program/domain/education-program.entity.spec';
import { CreateEducationProgramService } from '@modules/education-program/application/create-education-program.service';
import { Random } from '@core/test/random';
import { EducationProgramEntity } from '@modules/education-program/domain/education-program.entity';
import { CreateEntityEvent } from '@modules/event/infrastructure/events/create-entity.event';
import { EventActionEnum } from '@modules/event/application/create-event.service';
jest.mock('@modules/education-program/domain/education-program.entity');
//@ts-ignore
EducationProgramEntity.mockImplementation(() => mockEducationProgramInstance);

const helpers = new TestHelper(
  educationProgramRepositoryMockProvider,
  educationElementRepositoryMockProvider,
  chapterRepositoryMockProvider,
  {
    type: 'createService',
    provide: CreateProgramElementService,
    extend: [{ method: 'create', mockImplementation: jest.fn().mockResolvedValue(mockTestProgramElementInstance) }],
  },
);

describe('CreateEducationProgramService', () => {
  let createEducationProgramService: CreateEducationProgramService;

  beforeAll(async () => {
    [createEducationProgramService] = await helpers.beforeAll([CreateEducationProgramService]);
  });

  test('Should create education program and emit', async () => {
    await createEducationProgramService.create(
      {
        title: Random.lorem,
        description: Random.lorem,
        available: true,
        selfEnrollmentAllowed: true,
        chapterId: Random.id,
        educationElementIds: [Random.id],
      },
      Random.id,
    );

    const mockEventEmitter = helpers.getProviderValueByToken('EventEmitter2');
    const mockEducationProgramRepository = helpers.getProviderValueByToken('EducationProgramRepository');

    expect(mockEventEmitter.emit).toHaveBeenCalledTimes(1);
    expect(mockEventEmitter.emit).toHaveBeenCalledWith(
      EventActionEnum.CREATE_ENTITY,
      new CreateEntityEvent('программу обучения', Random.id, Random.id, 'Программы обучения'),
    );
    expect(mockEducationProgramRepository.save).toHaveBeenCalledTimes(1);
    expect(mockEducationProgramRepository.save).toHaveBeenCalledWith(mockEducationProgramInstance);
  });
});

import {
  assignmentRepositoryMockProvider,
  educationElementRepositoryMockProvider,
  groupRepositoryMockProvider,
  programSettingsRepositoryMockProvider,
  roleDibRepositoryMockProvider,
  TestHelper,
  userRepositoryMockProvider,
} from '@core/test/test.helper';
import { CreateTestSettingsService } from '@modules/education-program/application/create-test-settings.service';
import { CreateCourseSettingsService } from '@modules/education-program/application/create-course-settings.service';
import { CreateEducationProgramSettingsService } from '@modules/education-program/application/create-education-program-settings.service';
import { CreateAssignmentService } from '@modules/education-request/application/create-assignment.service';
import { EducationRequestOwnerTypeEnum } from '@modules/education-request/domain/education-request.entity';
import { Random } from '@core/test/random';
import { mockTestSettingsInstance } from '@modules/education-program/domain/test-settings.entity.spec';
import { AssignmentEntity } from '@modules/education-request/domain/assignment.entity';
import { mockTestAssignmentInstance } from '@modules/education-request/domain/assignment.entity.spec';
import { EducationElementTypeEnum } from '@modules/education-program/domain/education-element.entity';
import { mockCourseSettingsInstance } from '@modules/education-program/domain/course-settings.entity.spec';
import { mockEducationProgramSettingsInstance } from '@modules/education-program/domain/education-program-settings.entity.spec';

jest.mock('@modules/education-request/domain/assignment.entity');
//@ts-ignore
AssignmentEntity.mockImplementation(() => mockTestAssignmentInstance);

const helpers = new TestHelper(
  assignmentRepositoryMockProvider,
  educationElementRepositoryMockProvider,
  userRepositoryMockProvider,
  groupRepositoryMockProvider,
  roleDibRepositoryMockProvider,
  programSettingsRepositoryMockProvider,
  {
    type: 'createService',
    provide: CreateTestSettingsService,
    extend: [
      {
        method: 'create',
        mockImplementation: jest.fn().mockResolvedValue(mockTestSettingsInstance),
      },
    ],
  },
  { type: 'createService', provide: CreateCourseSettingsService },
  { type: 'createService', provide: CreateEducationProgramSettingsService },
);

describe('CreateAssignmentService', () => {
  let createAssignmentService: CreateAssignmentService;

  beforeAll(async () => {
    [createAssignmentService] = await helpers.beforeAll([CreateAssignmentService]);
  });

  test('Should create assignment', async () => {
    await createAssignmentService.create({
      ownerType: EducationRequestOwnerTypeEnum.USER,
      userId: Random.id,
      educationElementId: Random.id,
    });

    const mockAssignmentRepository = helpers.getProviderValueByToken('AssignmentRepository');

    expect(mockAssignmentRepository.save).toHaveBeenCalledTimes(1);
    expect(mockAssignmentRepository.save).toHaveBeenCalledWith(mockTestAssignmentInstance);
  });

  test('Should create many assignment and emit', async () => {
    // const createSpy = jest.spyOn(createAssignmentService, 'create')
    //
    // await createAssignmentService.createMany({
    //   owners: [{ ownerType: EducationRequestOwnerTypeEnum.USER, id: Random.id }],
    //   educationElementIds: [{ educationElementId: Random.id, elementType: EducationElementTypeEnum.TEST }],
    //   testSettings: mockTestSettingsInstance,
    //   courseSettings: mockCourseSettingsInstance,
    //   programSettings: mockEducationProgramSettingsInstance
    // })
    //
    // const mockEventEmitter = helpers.getProviderValueByToken('EventEmitter2')
    //
    // expect(createSpy).toHaveBeenCalledTimes(1)
    // expect(mockEventEmitter.emit).toHaveBeenCalledTimes(1)
  });
});

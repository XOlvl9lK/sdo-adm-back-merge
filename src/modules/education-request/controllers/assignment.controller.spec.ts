import { TestHelper } from '@core/test/test.helper';
import { CreateAssignmentService } from '@modules/education-request/application/create-assignment.service';
import { FindAssignmentService } from '@modules/education-request/application/find-assignment.service';
import { mockTestAssignmentInstance } from '@modules/education-request/domain/assignment.entity.spec';
import { Random } from '@core/test/random';
import { AssignmentController } from '@modules/education-request/controllers/assignment.controller';
import { mockUserInstance } from '@modules/user/domain/user.entity.spec';
import { EducationRequestOwnerTypeEnum } from '@modules/education-request/domain/education-request.entity';
import { mockCourseSettingsInstance } from '@modules/education-program/domain/course-settings.entity.spec';
import { mockTestSettingsInstance } from '@modules/education-program/domain/test-settings.entity.spec';
import { EducationElementTypeEnum } from '@modules/education-program/domain/education-element.entity';
import { mockEducationProgramSettingsInstance } from '@modules/education-program/domain/education-program-settings.entity.spec';

const helpers = new TestHelper(
  {
    type: 'createService',
    provide: CreateAssignmentService,
    extend: [{ method: 'createMany', mockImplementation: jest.fn() }],
  },
  {
    type: 'findService',
    provide: FindAssignmentService,
    mockValue: mockTestAssignmentInstance,
    extend: [
      {
        method: 'findAll',
        mockImplementation: jest.fn().mockResolvedValue([mockTestAssignmentInstance]),
      },
      {
        method: 'mockTestAssignmentInstance',
        mockImplementation: jest.fn().mockResolvedValue([[mockTestAssignmentInstance], Random.number]),
      },
      {
        method: 'findByGroupIdOrUserId',
        mockImplementation: jest.fn().mockResolvedValue([[mockTestAssignmentInstance], Random.number]),
      },
      {
        method: 'findAllGrouped',
        mockImplementation: jest.fn().mockResolvedValue([
          [
            {
              user: mockUserInstance,
              totalAssignments: 1,
              ownerType: EducationRequestOwnerTypeEnum.USER,
              id: Random.id,
            },
          ],
          Random.number,
        ]),
      },
    ],
  },
);

describe('AssignmentController', () => {
  let assignmentController: AssignmentController;

  beforeAll(async () => {
    [assignmentController] = await helpers.beforeAll([AssignmentController], [], [AssignmentController]);
  });

  test('Should return all assignments', async () => {
    const result = await assignmentController.getAll();

    expect(result).toEqual([mockTestAssignmentInstance]);
  });

  test('Should return all assignments grouped', async () => {
    const result = await assignmentController.getAllGrouped({});

    expect(result).toEqual({
      data: [
        {
          user: mockUserInstance,
          totalAssignments: 1,
          ownerType: EducationRequestOwnerTypeEnum.USER,
          id: Random.id,
        },
      ],
      total: Random.number,
    });
  });

  test('Should return assignments by group id or user id', async () => {
    const result = await assignmentController.getByGroupIdOrUserId(Random.id, {});

    expect(result).toEqual({
      data: [mockTestAssignmentInstance],
      total: Random.number,
    });
  });

  test('Should return assignment by id', async () => {
    const result = await assignmentController.getById(Random.id);

    expect(result).toEqual(mockTestAssignmentInstance);
  });

  test('Should call createMany', async () => {
    await assignmentController.enroll({
      programSettings: mockEducationProgramSettingsInstance,
      courseSettings: mockCourseSettingsInstance,
      testSettings: mockTestSettingsInstance,
      certificateIssuance: true,
      educationElementIds: [
        {
          educationElementId: Random.id,
          elementType: EducationElementTypeEnum.TEST,
        },
      ],
      owners: [{ ownerType: EducationRequestOwnerTypeEnum.USER, id: Random.id }],
    });

    const mockCreateAssignmentService = helpers.getProviderValueByToken('CreateAssignmentService');

    expect(mockCreateAssignmentService.createMany).toHaveBeenCalledTimes(1);
    expect(mockCreateAssignmentService.createMany).toHaveBeenCalledWith({
      programSettings: mockEducationProgramSettingsInstance,
      courseSettings: mockCourseSettingsInstance,
      testSettings: mockTestSettingsInstance,
      certificateIssuance: true,
      educationElementIds: [
        {
          educationElementId: Random.id,
          elementType: EducationElementTypeEnum.TEST,
        },
      ],
      owners: [{ ownerType: EducationRequestOwnerTypeEnum.USER, id: Random.id }],
    });
  });
});

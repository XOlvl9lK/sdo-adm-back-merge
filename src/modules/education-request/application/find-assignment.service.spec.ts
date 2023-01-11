import { assignmentRepositoryMockProvider, TestHelper } from '@core/test/test.helper';
import { FindAssignmentService } from '@modules/education-request/application/find-assignment.service';
import { mockTestAssignmentInstance } from '@modules/education-request/domain/assignment.entity.spec';
import { Random } from '@core/test/random';
import { mockUserInstance } from '@modules/user/domain/user.entity.spec';
import { EducationRequestOwnerTypeEnum } from '@modules/education-request/domain/education-request.entity';

const helpers = new TestHelper(assignmentRepositoryMockProvider);

describe('FindAssignmentService', () => {
  let findAssignmentService: FindAssignmentService;

  beforeAll(async () => {
    [findAssignmentService] = await helpers.beforeAll([FindAssignmentService]);
  });

  test('Should return all assignments', async () => {
    const result = await findAssignmentService.findAll();

    expect(result).toEqual([mockTestAssignmentInstance]);
  });

  test('Should return assignment by id', async () => {
    const result = await findAssignmentService.findById(Random.id);

    expect(result).toEqual(mockTestAssignmentInstance);
  });

  test('Should return all assignments grouped and count', async () => {
    const result = await findAssignmentService.findAllGrouped({});

    expect(result).toEqual([
      [
        {
          user: mockUserInstance,
          totalAssignments: 1,
          ownerType: EducationRequestOwnerTypeEnum.USER,
          id: Random.id,
        },
      ],
      1,
    ]);
  });

  test('Should return by group id or user id and count', async () => {
    const result = await findAssignmentService.findByGroupIdOrUserId(Random.id, {});

    expect(result).toEqual([[mockTestAssignmentInstance], Random.number]);
  });
});

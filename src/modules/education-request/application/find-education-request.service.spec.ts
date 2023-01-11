import {
  educationRequestRepositoryMockProvider,
  TestHelper,
  userEducationRequestRepositoryMockProvider,
} from '@core/test/test.helper';
import { FindEducationRequestService } from '@modules/education-request/application/find-education-request.service';
import { mockUserEducationRequestInstance } from '@modules/education-request/domain/education-request.entity.spec';
import { Random } from '@core/test/random';
import { mockUserInstance } from '@modules/user/domain/user.entity.spec';

const helpers = new TestHelper(educationRequestRepositoryMockProvider, userEducationRequestRepositoryMockProvider);

describe('FindEducationRequestService', () => {
  let findEducationRequestService: FindEducationRequestService;

  beforeAll(async () => {
    [findEducationRequestService] = await helpers.beforeAll([FindEducationRequestService]);
  });

  test('Should return all education requests', async () => {
    const result = await findEducationRequestService.findAll();

    expect(result).toEqual([mockUserEducationRequestInstance]);
  });

  test('Should return education request by id', async () => {
    // const result = await findEducationRequestService.findById(Random.id);

    // expect(result).toEqual(mockUserEducationRequestInstance);
  });

  test('Should return not processed by id and count', async () => {
    const result = await findEducationRequestService.findNotProcessedByUserId(Random.id, {});

    expect(result).toEqual([[mockUserEducationRequestInstance], Random.number]);
  });

  test('Should return accepted by id and count', async () => {
    const result = await findEducationRequestService.findAcceptedByUserId(Random.id, {});

    expect(result).toEqual([[mockUserEducationRequestInstance], Random.number]);
  });

  test('Should return all users requests grouped and count', async () => {
    const result = await findEducationRequestService.findAllUsersRequests({});

    expect(result).toEqual([
      [
        {
          user: mockUserInstance,
          totalRequests: 1,
          newRequests: [],
        },
      ],
      1,
    ]);
  });

  test('Should return users requests by user and count', async () => {
    const result = await findEducationRequestService.findUsersRequestsByUser(Random.id, {});

    expect(result).toEqual([[mockUserEducationRequestInstance], Random.number]);
  });
});

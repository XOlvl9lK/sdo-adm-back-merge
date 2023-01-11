import { TestHelper } from '@core/test/test.helper';
import { CreateEducationRequestService } from '@modules/education-request/application/create-education-request.service';
import { UpdateEducationRequestService } from '@modules/education-request/application/update-education-request.service';
import { FindEducationRequestService } from '@modules/education-request/application/find-education-request.service';
import { mockUserEducationRequestInstance } from '@modules/education-request/domain/education-request.entity.spec';
import { Random } from '@core/test/random';
import { DeleteEducationRequestService } from '@modules/education-request/application/delete-education-request.service';
import { EducationRequestController } from '@modules/education-request/controllers/education-request.controller';

const helpers = new TestHelper(
  {
    type: 'createService',
    provide: CreateEducationRequestService,
    extend: [{ method: 'createForUser', mockImplementation: jest.fn() }],
  },
  {
    type: 'updateService',
    provide: UpdateEducationRequestService,
    extend: [
      { method: 'accept', mockImplementation: jest.fn() },
      { method: 'acceptByIds', mockImplementation: jest.fn() },
      { method: 'reject', mockImplementation: jest.fn() },
      { method: 'rejectByIds', mockImplementation: jest.fn() },
    ],
  },
  {
    type: 'findService',
    provide: FindEducationRequestService,
    mockValue: mockUserEducationRequestInstance,
    extend: [
      {
        method: 'findAll',
        mockImplementation: jest.fn().mockResolvedValue([mockUserEducationRequestInstance]),
      },
      {
        method: 'findAllUsersRequests',
        mockImplementation: jest.fn().mockResolvedValue([[mockUserEducationRequestInstance], Random.number]),
      },
      {
        method: 'findUsersRequestsByUser',
        mockImplementation: jest.fn().mockResolvedValue([[mockUserEducationRequestInstance], Random.number]),
      },
      {
        method: 'findNotProcessedByUserId',
        mockImplementation: jest.fn().mockResolvedValue([[mockUserEducationRequestInstance], Random.number]),
      },
      {
        method: 'findAcceptedByUserId',
        mockImplementation: jest.fn().mockResolvedValue([[mockUserEducationRequestInstance], Random.number]),
      },
    ],
  },
  { type: 'deleteService', provide: DeleteEducationRequestService },
);

describe('EducationRequestController', () => {
  let educationRequestController: EducationRequestController;

  beforeAll(async () => {
    [educationRequestController] = await helpers.beforeAll(
      [EducationRequestController],
      [],
      [EducationRequestController],
    );
  });

  test('Should return all education requests', async () => {
    const result = await educationRequestController.getAll();

    expect(result).toEqual([mockUserEducationRequestInstance]);
  });

  test('Should return all users requests', async () => {
    const result = await educationRequestController.findAllUsersRequests({});

    expect(result).toEqual({
      data: [mockUserEducationRequestInstance],
      total: Random.number,
    });
  });

  test('Should return users requests by user', async () => {
    const result = await educationRequestController.findUsersRequestsByUser(Random.id, {});

    expect(result).toEqual({
      data: [mockUserEducationRequestInstance],
      total: Random.number,
    });
  });

  test('Should return education requests by current user', async () => {
    const result = await educationRequestController.getByCurrentUser(Random.id, {});

    expect(result).toEqual({
      data: [mockUserEducationRequestInstance],
      total: Random.number,
    });
  });

  test('Should return accepted by user id', async () => {
    const result = await educationRequestController.getAcceptedByUserId(Random.id, {});

    expect(result).toEqual({
      data: [mockUserEducationRequestInstance],
      total: Random.number,
    });
  });

  test('Should return education request by id', async () => {
    // const result = await educationRequestController.getById(Random.id);

    // expect(result).toEqual(mockUserEducationRequestInstance);
  });

  test('Should call createForUser', async () => {
    await educationRequestController.create(
      {
        userId: Random.id,
        educationElementId: Random.id,
      },
      Random.id,
    );

    const mockCreateEducationRequestService = helpers.getProviderValueByToken('CreateEducationRequestService');

    expect(mockCreateEducationRequestService.createForUser).toHaveBeenCalledTimes(1);
    expect(mockCreateEducationRequestService.createForUser).toHaveBeenCalledWith(
      {
        userId: Random.id,
        educationElementId: Random.id,
      },
      Random.id,
    );
  });

  test('Should call accept', async () => {
    await educationRequestController.accept({ userIds: Random.ids }, Random.id);

    const mockUpdateEducationRequestService = helpers.getProviderValueByToken('UpdateEducationRequestService');

    expect(mockUpdateEducationRequestService.accept).toHaveBeenCalledTimes(1);
    expect(mockUpdateEducationRequestService.accept).toHaveBeenCalledWith({ userIds: Random.ids }, Random.id);
  });

  test('Should call acceptByIds', async () => {
    await educationRequestController.acceptByIds({ educationRequestIds: Random.ids }, Random.id);

    const mockUpdateEducationRequestService = helpers.getProviderValueByToken('UpdateEducationRequestService');

    expect(mockUpdateEducationRequestService.acceptByIds).toHaveBeenCalledTimes(1);
    expect(mockUpdateEducationRequestService.acceptByIds).toHaveBeenCalledWith(
      { educationRequestIds: Random.ids },
      Random.id,
    );
  });

  test('Should call reject', async () => {
    await educationRequestController.reject({ userIds: Random.ids }, Random.id);

    const mockUpdateEducationRequestService = helpers.getProviderValueByToken('UpdateEducationRequestService');

    expect(mockUpdateEducationRequestService.reject).toHaveBeenCalledTimes(1);
    expect(mockUpdateEducationRequestService.reject).toHaveBeenCalledWith({ userIds: Random.ids }, Random.id);
  });

  test('Should call rejectByIds', async () => {
    await educationRequestController.rejectByIds({ educationRequestIds: Random.ids }, Random.id);

    const mockUpdateEducationRequestService = helpers.getProviderValueByToken('UpdateEducationRequestService');

    expect(mockUpdateEducationRequestService.rejectByIds).toHaveBeenCalledTimes(1);
    expect(mockUpdateEducationRequestService.rejectByIds).toHaveBeenCalledWith(
      { educationRequestIds: Random.ids },
      Random.id,
    );
  });

  test('Should call delete', async () => {
    await educationRequestController.delete(Random.id);

    const mockDeleteEducationRequestService = helpers.getProviderValueByToken('DeleteEducationRequestService');

    expect(mockDeleteEducationRequestService.delete).toHaveBeenCalledTimes(1);
    expect(mockDeleteEducationRequestService.delete).toHaveBeenCalledWith(Random.id);
  });
});

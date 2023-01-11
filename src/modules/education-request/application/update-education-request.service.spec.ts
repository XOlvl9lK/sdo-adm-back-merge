import { TestHelper, userEducationRequestRepositoryMockProvider } from '@core/test/test.helper';
import { CreateAssignmentService } from '@modules/education-request/application/create-assignment.service';
import { mockTestAssignmentInstance } from '@modules/education-request/domain/assignment.entity.spec';
import { UpdateEducationRequestService } from '@modules/education-request/application/update-education-request.service';
import { Random } from '@core/test/random';
import { EducationRequestOwnerTypeEnum } from '@modules/education-request/domain/education-request.entity';
import { EventActionEnum } from '@modules/event/application/create-event.service';
import { EducationRequestAcceptEvent } from '@modules/event/infrastructure/events/education-request-accept.event';
import { EducationElementTypeEnum } from '@modules/education-program/domain/education-element.entity';
import { mockUserEducationRequestInstance } from '@modules/education-request/domain/education-request.entity.spec';
import clearAllMocks = jest.clearAllMocks;

const helpers = new TestHelper(userEducationRequestRepositoryMockProvider, {
  type: 'createService',
  provide: CreateAssignmentService,
  extend: [
    {
      method: 'create',
      mockImplementation: jest.fn().mockResolvedValue(mockTestAssignmentInstance),
    },
  ],
});

describe('UpdateEducationRequestService', () => {
  let updateEducationRequestService: UpdateEducationRequestService;

  beforeAll(async () => {
    [updateEducationRequestService] = await helpers.beforeAll([UpdateEducationRequestService]);
  });

  test('Should accept education request and emit', async () => {
    await updateEducationRequestService.accept({ userIds: [Random.id] }, Random.id);

    const mockEventEmitter = helpers.getProviderValueByToken('EventEmitter2');
    const mockCreateAssignmentService = helpers.getProviderValueByToken('CreateAssignmentService');
    const mockUserEducationRequestRepository = helpers.getProviderValueByToken('UserEducationRequestRepository');

    expect(mockCreateAssignmentService.create).toHaveBeenCalledTimes(1);
    expect(mockCreateAssignmentService.create).toHaveBeenCalledWith({
      ownerType: EducationRequestOwnerTypeEnum.USER,
      userId: Random.id,
      educationElementId: Random.id,
    });
    expect(mockEventEmitter.emit).toHaveBeenCalledTimes(1);
    expect(mockEventEmitter.emit).toHaveBeenCalledWith(
      EventActionEnum.EDUCATION_REQUEST_ACCEPT,
      new EducationRequestAcceptEvent(Random.id, Random.id, EducationElementTypeEnum.TEST, Random.id, Random.id, ''),
    );
    expect(mockUserEducationRequestRepository.save).toHaveBeenCalledTimes(1);
    expect(mockUserEducationRequestRepository.save).toHaveBeenCalledWith([mockUserEducationRequestInstance]);
  });

  test('Should reject education request', async () => {
    await updateEducationRequestService.reject({ userIds: [Random.id] }, Random.id);

    const mockUserEducationRequestRepository = helpers.getProviderValueByToken('UserEducationRequestRepository');

    expect(mockUserEducationRequestRepository.save).toHaveBeenCalledTimes(1);
    expect(mockUserEducationRequestRepository.save).toHaveBeenCalledWith([mockUserEducationRequestInstance]);
  });

  test('Should accept education request by ids and emit', async () => {
    await updateEducationRequestService.acceptByIds({ educationRequestIds: [Random.id] }, Random.id);

    const mockEventEmitter = helpers.getProviderValueByToken('EventEmitter2');
    const mockCreateAssignmentService = helpers.getProviderValueByToken('CreateAssignmentService');
    const mockUserEducationRequestRepository = helpers.getProviderValueByToken('UserEducationRequestRepository');

    expect(mockCreateAssignmentService.create).toHaveBeenCalledTimes(1);
    expect(mockCreateAssignmentService.create).toHaveBeenCalledWith({
      ownerType: EducationRequestOwnerTypeEnum.USER,
      userId: Random.id,
      educationElementId: Random.id,
    });
    expect(mockEventEmitter.emit).toHaveBeenCalledTimes(1);
    expect(mockEventEmitter.emit).toHaveBeenCalledWith(
      EventActionEnum.EDUCATION_REQUEST_ACCEPT,
      new EducationRequestAcceptEvent(Random.id, Random.id, EducationElementTypeEnum.TEST, Random.id, Random.id, ''),
    );
    expect(mockUserEducationRequestRepository.save).toHaveBeenCalledTimes(1);
    expect(mockUserEducationRequestRepository.save).toHaveBeenCalledWith([mockUserEducationRequestInstance]);
  });

  test('Should reject education request by ids', async () => {
    await updateEducationRequestService.rejectByIds({ educationRequestIds: [Random.id] }, Random.id);

    const mockUserEducationRequestRepository = helpers.getProviderValueByToken('UserEducationRequestRepository');

    expect(mockUserEducationRequestRepository.save).toHaveBeenCalledTimes(1);
    expect(mockUserEducationRequestRepository.save).toHaveBeenCalledWith([mockUserEducationRequestInstance]);
  });

  afterEach(() => {
    clearAllMocks();
  });
});

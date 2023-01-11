import {
  educationElementRepositoryMockProvider,
  TestHelper,
  userEducationRequestRepositoryMockProvider,
  userRepositoryMockProvider,
} from '@core/test/test.helper';
import { CreateAssignmentService } from '@modules/education-request/application/create-assignment.service';
import { mockTestAssignmentInstance } from '@modules/education-request/domain/assignment.entity.spec';
import { CreateEducationRequestService } from '@modules/education-request/application/create-education-request.service';
import {
  EducationRequestOwnerTypeEnum,
  UserEducationRequestEntity,
} from '@modules/education-request/domain/education-request.entity';
import { mockUserEducationRequestInstance } from '@modules/education-request/domain/education-request.entity.spec';
import { Random } from '@core/test/random';
import { EventActionEnum } from '@modules/event/application/create-event.service';
import { EducationRequestAcceptEvent } from '@modules/event/infrastructure/events/education-request-accept.event';
import { EducationElementTypeEnum } from '@modules/education-program/domain/education-element.entity';
import { EducationRequestEvent } from '@modules/event/infrastructure/events/education-request.event';

jest.mock('@modules/education-request/domain/education-request.entity');
//@ts-ignore
UserEducationRequestEntity.mockImplementation(() => mockUserEducationRequestInstance);

const helpers = new TestHelper(
  userEducationRequestRepositoryMockProvider,
  educationElementRepositoryMockProvider,
  userRepositoryMockProvider,
  {
    type: 'createService',
    provide: CreateAssignmentService,
    extend: [
      {
        method: 'create',
        mockImplementation: jest.fn().mockResolvedValue(mockTestAssignmentInstance),
      },
    ],
  },
);

describe('CreateEducationRequestService', () => {
  let createEducationRequestService: CreateEducationRequestService;

  beforeAll(async () => {
    [createEducationRequestService] = await helpers.beforeAll([CreateEducationRequestService]);
  });

  test('Should create education request and emit twice', async () => {
    await createEducationRequestService.createForUser(
      {
        educationElementId: Random.id,
        userId: Random.id,
        validityFrom: Random.datePast.toISOString(),
        validityTo: Random.dateFuture.toISOString(),
      },
      Random.lorem,
    );

    const mockCreateAssignmentService = helpers.getProviderValueByToken('CreateAssignmentService');
    const mockEventEmitter = helpers.getProviderValueByToken('EventEmitter2');
    const mockUserEducationRequestRepository = helpers.getProviderValueByToken('UserEducationRequestRepository');

    expect(mockCreateAssignmentService.create).toHaveBeenCalledTimes(1);
    expect(mockCreateAssignmentService.create).toHaveBeenCalledWith({
      ownerType: EducationRequestOwnerTypeEnum.USER,
      userId: Random.id,
      educationElementId: Random.id,
    });
    expect(mockEventEmitter.emit).toHaveBeenCalledTimes(2);
    expect(mockEventEmitter.emit).toHaveBeenCalledWith(
      EventActionEnum.EDUCATION_REQUEST_ACCEPT,
      new EducationRequestAcceptEvent(Random.id, Random.id, EducationElementTypeEnum.TEST, Random.id, Random.id, ''),
    );
    expect(mockEventEmitter.emit).toHaveBeenCalledWith(
      EventActionEnum.EDUCATION_REQUEST,
      new EducationRequestEvent(Random.lorem, Random.id, 'Тесты'),
    );
    expect(mockUserEducationRequestRepository.save).toHaveBeenCalledTimes(1);
    expect(mockUserEducationRequestRepository.save).toHaveBeenCalledWith(mockUserEducationRequestInstance);
  });
});

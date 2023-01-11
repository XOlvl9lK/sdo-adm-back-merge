import { mockBaseEntity } from '@core/domain/base.entity.mock';
import { mockTestInstance } from '@modules/test/domain/test.entity.spec';
import {
  EducationRequestEntity,
  EducationRequestOwnerTypeEnum,
  EducationRequestStatusEnum,
  GroupEducationRequestEntity,
  UserEducationRequestEntity,
} from '@modules/education-request/domain/education-request.entity';
import { Random } from '@core/test/random';
import { plainToInstance } from 'class-transformer';
import { mockUserInstance } from '@modules/user/domain/user.entity.spec';
import { mockGroupInstance } from '@modules/group/domain/group.entity.spec';

const mockEducationRequest = {
  ...mockBaseEntity,
  educationElement: mockTestInstance,
  status: EducationRequestStatusEnum.ACCEPTED,
  ownerType: EducationRequestOwnerTypeEnum.USER,
  validityFrom: Random.datePast,
  validityTo: Random.dateFuture,
};

export const mockEducationRequestInstance = plainToInstance(EducationRequestEntity, mockEducationRequest);

const mockUserEducationRequest = {
  ...mockEducationRequest,
  user: mockUserInstance,
  userId: Random.id,
  initiateByUser: true,
};

export const mockUserEducationRequestInstance = plainToInstance(UserEducationRequestEntity, mockUserEducationRequest);

const mockGroupEducationRequest = {
  ...mockEducationRequest,
  ownerType: EducationRequestOwnerTypeEnum.GROUP,
  group: mockGroupInstance,
  groupId: Random.id,
};

export const mockGroupEducationRequestInstance = plainToInstance(
  GroupEducationRequestEntity,
  mockGroupEducationRequest,
);

describe('EducationRequestEntity', () => {
  test('Should accept request', () => {
    mockUserEducationRequestInstance.status = EducationRequestStatusEnum.NOT_PROCESSED;
    mockUserEducationRequestInstance.accept();

    expect(mockUserEducationRequestInstance.status).toBe(EducationRequestStatusEnum.ACCEPTED);

    mockUserEducationRequestInstance.status = EducationRequestStatusEnum.ACCEPTED;
  });

  test('Should reject request', () => {
    mockUserEducationRequestInstance.status = EducationRequestStatusEnum.NOT_PROCESSED;
    mockUserEducationRequestInstance.reject();

    expect(mockUserEducationRequestInstance.status).toBe(EducationRequestStatusEnum.REJECTED);

    mockUserEducationRequestInstance.status = EducationRequestStatusEnum.ACCEPTED;
  });
});

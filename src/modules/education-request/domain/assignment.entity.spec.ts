import { mockBaseEntity } from '@core/domain/base.entity.mock';
import { mockUserInstance } from '@modules/user/domain/user.entity.spec';
import { EducationRequestOwnerTypeEnum } from '@modules/education-request/domain/education-request.entity';
import { mockTestSettingsInstance } from '@modules/education-program/domain/test-settings.entity.spec';
import { Random } from '@core/test/random';
import { plainToInstance } from 'class-transformer';
import { AssignmentEntity } from '@modules/education-request/domain/assignment.entity';
import { mockThemeInTestInstance } from '@modules/test/domain/test.entity.spec';
import { mockEducationProgramInstance } from '@modules/education-program/domain/education-program.entity.spec';
import { mockEducationProgramSettingsInstance } from '@modules/education-program/domain/education-program-settings.entity.spec';
import { mockCourseInstance } from '@modules/course/domain/course.entity.spec';
import { mockCourseSettingsInstance } from '@modules/education-program/domain/course-settings.entity.spec';
import { TestEntity } from '@modules/test/domain/test.entity';
import { mockEducationElement } from '@modules/education-program/domain/education-element.entity.spec';
import { EducationElementTypeEnum } from '@modules/education-program/domain/education-element.entity';

const mockTestAssignment = {
  ...mockBaseEntity,
  user: mockUserInstance,
  educationElement: plainToInstance(TestEntity, {
    ...mockEducationElement,
    elementType: EducationElementTypeEnum.TEST,
    threshold: Random.number,
    totalThemes: Random.number,
    themes: [mockThemeInTestInstance, mockThemeInTestInstance],
  }),
  ownerType: EducationRequestOwnerTypeEnum.USER,
  testSettings: mockTestSettingsInstance,
  testSettingsId: Random.id,
  startDate: Random.datePast,
  endDate: Random.dateFuture,
  isObligatory: true,
  certificateIssuance: true,
};

export const mockTestAssignmentInstance = plainToInstance(AssignmentEntity, mockTestAssignment, {
  enableCircularCheck: true,
});

const mockEducationProgramAssignment = {
  ...mockBaseEntity,
  user: mockUserInstance,
  educationElement: mockEducationProgramInstance,
  ownerType: EducationRequestOwnerTypeEnum.USER,
  educationProgramSettings: mockEducationProgramSettingsInstance,
  educationProgramSettingsId: Random.id,
  startDate: Random.datePast,
  endDate: Random.dateFuture,
  isObligatory: true,
  certificateIssuance: true,
};

export const mockEducationProgramAssignmentInstance = plainToInstance(
  AssignmentEntity,
  mockEducationProgramAssignment,
  {
    enableCircularCheck: true,
  },
);

const mockCourseAssignment = {
  ...mockBaseEntity,
  user: mockUserInstance,
  educationElement: mockCourseInstance,
  ownerType: EducationRequestOwnerTypeEnum.USER,
  courseSettings: mockCourseSettingsInstance,
  courseSettingsId: Random.id,
  startDate: Random.datePast,
  endDate: Random.dateFuture,
  isObligatory: true,
  certificateIssuance: true,
};

export const mockCourseAssignmentInstance = plainToInstance(AssignmentEntity, mockCourseAssignment);

describe('AssignmentEntity', () => {
  test('Should update', () => {
    // mockTestAssignmentInstance.update(new Date(10), new Date(10), false, false);

    expect(mockTestAssignmentInstance.startDate).toEqual(new Date(10));
    expect(mockTestAssignmentInstance.endDate).toEqual(new Date(10));
    expect(mockTestAssignmentInstance.isObligatory).toBe(false);
    expect(mockTestAssignmentInstance.certificateIssuance).toBe(false);

    mockTestAssignmentInstance.startDate = Random.datePast;
    mockTestAssignmentInstance.endDate = Random.datePast;
    mockTestAssignmentInstance.isObligatory = true;
    mockTestAssignmentInstance.certificateIssuance = true;
  });
});

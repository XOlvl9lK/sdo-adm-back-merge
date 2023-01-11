import { mockEducationElement } from '@modules/education-program/domain/education-element.entity.spec';
import { EducationElementTypeEnum } from '@modules/education-program/domain/education-element.entity';
import { Random } from '@core/test/random';
import { mockBaseEntity } from '@core/domain/base.entity.mock';
import { plainToInstance } from 'class-transformer';
import { EducationProgramEntity } from '@modules/education-program/domain/education-program.entity';
import {
  ProgramElementTypeEnum,
  TestProgramElementEntity,
} from '@modules/education-program/domain/program-element.entity';
import { mockTestInstance } from '@modules/test/domain/test.entity.spec';
import { mockTestSettingsInstance } from '@modules/education-program/domain/test-settings.entity.spec';

const mockTestProgramElement = {
  ...mockBaseEntity,
  educationProgram: plainToInstance(EducationProgramEntity, {
    ...mockEducationElement,
    elementType: EducationElementTypeEnum.PROGRAM,
    totalElements: Random.number,
  }),
  elementType: ProgramElementTypeEnum.TEST,
  order: Random.number,
  test: mockTestInstance,
  testSettings: mockTestSettingsInstance,
  testSettingsId: Random.id,
};

export const mockTestProgramElementInstance = plainToInstance(TestProgramElementEntity, mockTestProgramElement, {
  enableCircularCheck: true,
});

const mockEducationProgram = {
  ...mockEducationElement,
  elementType: EducationElementTypeEnum.PROGRAM,
  totalElements: Random.number,
  programElements: [mockTestProgramElementInstance],
};

export const mockEducationProgramInstance = plainToInstance(EducationProgramEntity, mockEducationProgram, {
  enableCircularCheck: true,
});

describe('EducationProgramEntity', () => {
  test('Should add program elements', () => {
    mockEducationProgramInstance.addProgramElements([mockTestProgramElementInstance, mockTestProgramElementInstance]);

    expect(mockEducationProgramInstance.programElements).toEqual([
      mockTestProgramElementInstance,
      mockTestProgramElementInstance,
      mockTestProgramElementInstance,
    ]);
    expect(mockEducationProgramInstance.totalElements).toBe(3);
  });

  test('Should update', () => {
    mockEducationProgramInstance.update('Title', 'Description', null, false, false, []);

    expect(mockEducationProgramInstance.title).toBe('Title');
    expect(mockEducationProgramInstance.description).toBe('Description');
    expect(mockEducationProgramInstance.isSelfAssignmentAvailable).toBe(false);
    expect(mockEducationProgramInstance.available).toBe(false);
  });
});

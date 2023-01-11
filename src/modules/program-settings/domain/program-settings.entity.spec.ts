import { mockBaseEntity } from '@core/domain/base.entity.mock';
import { mockRoleDibInstance } from '@modules/user/domain/user.entity.spec';
import { mockTestInstance } from '@modules/test/domain/test.entity.spec';
import { plainToInstance } from 'class-transformer';
import { ProgramSettingsEntity } from '@modules/program-settings/domain/program-settings.entity';

const mockProgramSettings = {
  ...mockBaseEntity,
  role: mockRoleDibInstance,
  obligatory: [mockTestInstance],
  optional: [mockTestInstance],
};

export const mockProgramSettingsInstance = plainToInstance(ProgramSettingsEntity, mockProgramSettings);

describe('ProgramSettingsEntity', () => {
  test('Should set obligatory', () => {
    mockProgramSettingsInstance.setObligatory([mockTestInstance, mockTestInstance, mockTestInstance]);

    expect(mockProgramSettingsInstance.obligatory).toEqual([mockTestInstance, mockTestInstance, mockTestInstance]);
  });

  test('Should set optional', () => {
    mockProgramSettingsInstance.setOptional([mockTestInstance, mockTestInstance, mockTestInstance]);

    expect(mockProgramSettingsInstance.optional).toEqual([mockTestInstance, mockTestInstance, mockTestInstance]);
  });
});

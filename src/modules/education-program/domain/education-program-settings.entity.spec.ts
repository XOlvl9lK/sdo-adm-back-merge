import { MixingTypeEnum } from '@modules/education-program/domain/test-settings.entity';
import { mockBaseEntity } from '@core/domain/base.entity.mock';
import { Random } from '@core/test/random';
import { plainToInstance } from 'class-transformer';
import { EducationProgramSettingsEntity } from '@modules/education-program/domain/education-program-settings.entity';

const mockEducationProgramSettings = {
  ...mockBaseEntity,
  orderOfStudy: MixingTypeEnum.RANDOM,
  startDate: Random.datePast,
  endDate: Random.dateFuture,
};

export const mockEducationProgramSettingsInstance = plainToInstance(
  EducationProgramSettingsEntity,
  mockEducationProgramSettings,
);

describe('EducationProgramSettingsEntity', () => {
  test('Should update', () => {
    // mockEducationProgramSettingsInstance.update(MixingTypeEnum.ORIGINAL, new Date(10), new Date(10));

    expect(mockEducationProgramSettingsInstance.orderOfStudy).toBe(MixingTypeEnum.ORIGINAL);
    expect(mockEducationProgramSettingsInstance.startDate).toEqual(new Date(10));
    expect(mockEducationProgramSettingsInstance.endDate).toEqual(new Date(10));
  });
});

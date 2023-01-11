import { IsEnum, IsOptional, IsString } from 'class-validator';
import { MixingTypeEnum } from '@modules/education-program/domain/test-settings.entity';

export class UpdateEducationProgramSettingsDto {
  @IsString({ message: 'Должно быть строкой' })
  id: string;

  assignmentId: string;

  @IsEnum(MixingTypeEnum, {
    message: 'Должно быть одним из значений MixingTypeEnum',
  })
  orderOfStudy: MixingTypeEnum;

  @IsOptional()
  @IsString({ message: 'Должно быть строкой' })
  startDate?: string;

  @IsOptional()
  @IsString({ message: 'Должно быть строкой' })
  endDate?: string;

  isObligatory?: boolean;

  certificateIssuance?: boolean;
}

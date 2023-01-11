import { CreateTestSettingsDto } from '@modules/education-program/controllers/dtos/create-test-settings.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateTestSettingsDto extends CreateTestSettingsDto {
  @IsString({ message: 'Должно быть строкой' })
  id: string;

  assignmentId: string;

  @IsOptional()
  @IsString({ message: 'Должно быть строкой' })
  startDate?: string;

  @IsOptional()
  @IsString({ message: 'Должно быть строкой' })
  endDate?: string;

  certificateIssuance?: boolean;
}

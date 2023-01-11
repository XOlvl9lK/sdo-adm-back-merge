import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateCourseSettingsDto {
  @IsString({ message: 'Должно быть строкой' })
  id: string;

  assignmentId: string;

  @IsOptional()
  @IsNumber({}, { message: 'Должно быть числом' })
  timeLimit?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Должно быть числом' })
  numberOfAttempts?: number;

  @IsOptional()
  @IsBoolean({ message: 'Должно быть логическим значением' })
  isObligatory?: boolean;

  @IsOptional()
  @IsString({ message: 'Должно быть строкой' })
  startDate?: string;

  @IsOptional()
  @IsString({ message: 'Должно быть строкой' })
  endDate?: string;

  certificateIssuance?: boolean;
}

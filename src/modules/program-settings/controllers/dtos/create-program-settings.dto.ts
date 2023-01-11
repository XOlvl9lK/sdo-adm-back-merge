import { IsString } from 'class-validator';

export class CreateProgramSettingsDto {
  @IsString({ message: 'Должно быть строкой' })
  roleId: string;
}

import { IsArray, IsString } from 'class-validator';

export class DeleteProgramSettingsDto {
  @IsArray({ message: 'Должно быть массивом' })
  @IsString({ each: true, message: 'Должно быть стокой' })
  programSettingsIds: string[];
}

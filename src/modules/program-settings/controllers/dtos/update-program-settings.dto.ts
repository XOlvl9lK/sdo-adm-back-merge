import { IsArray, IsString } from 'class-validator';

export class UpdateProgramSettingsDto {
  @IsString({ message: 'Должно быть строкой' })
  programSettingsId: string;

  @IsArray({ message: 'Должно быть массивом' })
  @IsString({ each: true, message: 'Должно быть строкой' })
  educationElementIds: string[];
}

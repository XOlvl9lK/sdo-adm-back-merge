import { IsArray, IsString } from 'class-validator';

export class ArchiveDto {
  @IsArray({ message: 'Должно быть массивом' })
  @IsString({ each: true, message: 'Должно быть строкой' })
  ids: string[];
}

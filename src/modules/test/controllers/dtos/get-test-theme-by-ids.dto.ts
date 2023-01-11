import { IsArray } from 'class-validator';

export class GetTestThemeByIdsDto {
  @IsArray()
  ids: string[];
}

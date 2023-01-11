import { CreateTestThemeDto } from '@modules/test/controllers/dtos/create-test-theme.dto';
import { IsEnum, IsString } from 'class-validator';
import { ViewQuery } from '@core/libs/types';

export enum SingleSortActionTypesEnum {
  UP = 'UP',
  DOWN = 'DOWN',
}

export class UpdateTestThemeDto extends CreateTestThemeDto {
  @IsString({ message: 'Должно быть строкой' })
  id: string;
}

export class ChangeOrderThemeInTestDto {
  @IsString({ message: 'Должно быть строкой' })
  testId: string;

  @IsString({ message: 'Должно быть строкой' })
  themeId: string;

  @IsEnum(SingleSortActionTypesEnum, { message: 'Должно быть одним из значений SingleSortActionTypesEnum' })
  sortActionType: SingleSortActionTypesEnum;

  view: ViewQuery;
}

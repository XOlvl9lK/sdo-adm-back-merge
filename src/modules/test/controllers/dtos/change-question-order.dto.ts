import { IsEnum, IsString } from 'class-validator';
import { SingleSortActionTypesEnum } from '@modules/test/controllers/dtos/update-test-theme.dto';
import { ViewQuery } from '@core/libs/types';

export class ChangeQuestionOrderDto {
  @IsString({ message: 'Должно быть строкой' })
  themeId: string;

  @IsString({ message: 'Должно быть строкой' })
  questionId: string;

  @IsEnum(SingleSortActionTypesEnum, { message: 'Должно быть одним из значений SingleSortActionTypesEnum' })
  sortActionType: SingleSortActionTypesEnum;

  view: ViewQuery;
}

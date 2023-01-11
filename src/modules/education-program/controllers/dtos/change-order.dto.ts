import { IsEnum, IsString } from 'class-validator';
import { ViewQuery } from '@core/libs/types';

export enum ChangeOrderTypeEnum {
  UP = 'UP',
  DOWN = 'DOWN',
}

export class ChangeOrderDto {
  @IsString()
  id: string;

  @IsEnum(ChangeOrderTypeEnum)
  type: ChangeOrderTypeEnum;

  view: ViewQuery;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { FindSpvHistory } from '../../services/find-spv-history.service';
import { ListRequestDto } from '@common/utils/types';
import { RequestStateEnum } from '@modules/spv-history/domain/request-state.enum';
import { SpvMethodNameEnum } from '@modules/spv-history/domain/spv-method-name.enum';

export class FindSpvHistoryDto extends ListRequestDto implements FindSpvHistory {
  @ApiProperty({
    description: 'Диапазон дат',
    example: [new Date().toISOString(), new Date().toISOString()],
    required: false,
  })
  @IsOptional()
  startDate?: [string, string];

  @ApiProperty({
    description: 'Наименования внешнего ОВ',
    isArray: true,
    required: false,
  })
  @IsOptional()
  @IsString({ each: true })
  departmentName?: string[];

  @ApiProperty({
    description: 'Статус запроса',
    required: false,
    isArray: false,
  })
  @IsOptional()
  @IsEnum(SpvMethodNameEnum, { each: true })
  methodName?: SpvMethodNameEnum[];

  @ApiProperty({
    description: 'Статусы запросов',
    isArray: true,
    required: false,
  })
  @IsOptional()
  @IsEnum(RequestStateEnum, { each: true })
  requestState?: RequestStateEnum[];
}

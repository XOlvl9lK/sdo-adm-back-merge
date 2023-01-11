import { ListRequestDto } from '@common/utils/types';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { SmevHistoryStateEnum } from '@modules/smev-history/domain/smev-history-state.enum';
import { SmevMethodNameEnum } from '@modules/smev-history/domain/smev-method-name.enum';

export class FindSmevHistoryDto extends ListRequestDto {
  @ApiProperty({
    description: 'Наименование внешнего ОВ',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  departmentName?: string[];

  @ApiProperty({
    description: 'Статус запроса',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsEnum(SmevHistoryStateEnum, { each: true })
  state?: SmevHistoryStateEnum[];

  @ApiProperty({
    description: 'Дата и время начала',
    required: false,
  })
  @IsOptional()
  createDate?: [string, string];

  @ApiProperty({
    description: 'Дата и время окончания',
    required: false,
  })
  @IsOptional()
  updateDate?: [string, string];

  @ApiProperty({
    required: false,
    description: 'Тип запроса',
  })
  @IsOptional()
  @IsEnum(SmevMethodNameEnum, { each: true })
  methodName?: SmevMethodNameEnum[];
}

import { ListRequestDto } from '@common/utils/types';
import { FileHistoryStatusEnum } from '@modules/file-history/domain/file-history-status.enum';
import { FindAllFileHistory } from '@modules/file-history/services/find-all-file-history.service';
import { Transform } from 'class-transformer';
import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator';

export class FindFileHistoryDto extends ListRequestDto implements FindAllFileHistory {
  @IsOptional()
  @Transform(({ value }) => (value ? value.map((v) => new Date(v)) : undefined))
  @IsDate({ each: true })
  startDate?: [Date, Date];

  @IsOptional()
  @IsString({ each: true })
  departmentName?: string[];

  @IsOptional()
  @IsEnum(FileHistoryStatusEnum, { each: true })
  status?: FileHistoryStatusEnum[];
}

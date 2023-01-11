import { IsString } from 'class-validator';

export class CreateAuthorityRequestDto {
  @IsString({ message: 'Должно быть строкой' })
  title: string;
}

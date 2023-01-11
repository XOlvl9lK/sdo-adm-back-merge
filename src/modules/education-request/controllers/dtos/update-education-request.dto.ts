import { IsArray, IsString } from 'class-validator';

export class UpdateEducationRequestDto {
  @IsArray()
  @IsString({ each: true, message: 'Должно быть строкой' })
  userIds: string[];
}

export class UpdateEducationRequestByIdsDto {
  educationRequestIds: string[];
}

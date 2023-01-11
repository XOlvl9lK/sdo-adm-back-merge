import { IsArray, IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator';
import { EducationRequestOwnerTypeEnum } from '@modules/education-request/domain/education-request.entity';

export class CreateUserEducationRequestRequestDto {
  @IsString({ message: 'Должно быть строкой' })
  educationElementId: string;

  @IsString({ message: 'Должно быть строкой' })
  userId: string;

  @IsOptional()
  @IsString({ message: 'Должно быть строкой' })
  validityFrom?: string;

  @IsOptional()
  @IsString({ message: 'Должно быть строкой' })
  validityTo?: string;
}

export class CreateGroupEducationRequestRequestDto {
  @IsString({ message: 'Должно быть строкой' })
  educationElementId: string;

  @IsString({ message: 'Должно быть строкой' })
  groupId: string;

  @IsOptional()
  @IsString({ message: 'Должно быть строкой' })
  validityFrom?: string;

  @IsOptional()
  @IsString({ message: 'Должно быть строкой' })
  validityTo?: string;
}

export class CreateManyEducationRequestsRequestDto {
  @IsArray({ message: 'Должно быть массивом' })
  @ValidateNested()
  owners: CreateManyEducationRequestsOwnerRequestDto[];

  @IsArray({ message: 'Должно быть массивом' })
  educationElementIds: string[];

  @IsOptional()
  @IsString({ message: 'Должно быть строкой' })
  validityFrom?: string;

  @IsOptional()
  @IsString({ message: 'Должно быть строкой' })
  validityTo?: string;
}

export class CreateManyEducationRequestsOwnerRequestDto {
  @IsEnum(EducationRequestOwnerTypeEnum, {
    message: 'Должно быть одним из значений EducationRequestOwnerTypeEnum',
  })
  ownerType: EducationRequestOwnerTypeEnum;

  @IsString({ message: 'Должно быть строкой' })
  id: string;
}

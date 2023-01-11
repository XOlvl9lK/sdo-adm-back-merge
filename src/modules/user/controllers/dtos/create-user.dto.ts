import { IsDate, IsEmail, IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { GenderEnum } from '@modules/user/domain/user.entity';

export class CreateUserDto {
  @IsString({ message: 'Логин должен быть строкой' })
  login: string;

  @Length(5, 12, {
    message: 'Пароль должен быть больше 5 символов и меньше 12',
  })
  password?: string;

  @IsString({ message: 'Должно быть строкой' })
  roleId: string;

  @IsOptional()
  @IsEmail({ message: 'Должно быть валидным' })
  email?: string;

  @IsOptional()
  @IsString({ message: 'Должно быть строкой' })
  firstName?: string;

  @IsOptional()
  @IsString({ message: 'Должно быть строкой' })
  middleName?: string;

  @IsOptional()
  @IsString({ message: 'Должно быть строкой' })
  lastName?: string;

  @IsOptional()
  @IsString({ message: 'Должно быть строкой' })
  organization?: string;

  @IsOptional()
  @IsString({ message: 'Должно быть строкой' })
  institution?: string;

  @IsOptional()
  @IsEnum(GenderEnum, { message: 'Дожно быть одним из значений GenderEnum' })
  gender?: GenderEnum;

  @IsOptional()
  @IsDate({ message: 'Должно быть датой' })
  validityFrom?: string;

  @IsOptional()
  @IsDate({ message: 'Должно быть датой' })
  validityTo?: string;

  isPersonalDataRequired?: boolean;

  @IsOptional()
  @IsString({ message: 'Должно быть строкой' })
  departmentId?: string;

  @IsOptional()
  @IsString({ message: 'Должно быть строкой' })
  regionId?: string;

  @IsOptional()
  @IsString({ message: 'Должно быть строкой' })
  subdivisionId?: string;

  @IsOptional()
  @IsString({ message: 'Должно быть строкой' })
  roleDibId?: string;
}

import { IsString, Length } from 'class-validator';

export class LoginDto {
  @IsString({ message: 'Логин должен быть строкой' })
  login: string;

  @Length(5, 12, {
    message: 'Пароль должен быть больше 5 символов и меньше 12',
  })
  password: string;
}

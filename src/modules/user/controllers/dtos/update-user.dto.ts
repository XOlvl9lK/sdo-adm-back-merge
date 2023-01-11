import { CreateUserDto } from '@modules/user/controllers/dtos/create-user.dto';
import { IsString } from 'class-validator';

export class UpdateUserDto extends CreateUserDto {
  @IsString({ message: 'Должно быть строкой' })
  id: string;
}

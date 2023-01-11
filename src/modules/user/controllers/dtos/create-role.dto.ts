import { IsString } from 'class-validator';

export class CreateRoleDto {
  @IsString({ message: 'Должно быть строкой' })
  title: string;

  description?: string;

  parentRoleId?: string;
}

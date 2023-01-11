import { CreateEducationProgramDto } from '@modules/education-program/controllers/dtos/create-education-program.dto';
import { IsString } from 'class-validator';

export class UpdateEducationProgramDto extends CreateEducationProgramDto {
  @IsString({ message: 'Должно быть строкой' })
  id: string;
}

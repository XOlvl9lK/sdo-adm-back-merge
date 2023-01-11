import { IsNumber, IsString } from 'class-validator';

export class CreateProgramElementDto {
  @IsString({ message: 'Должно быть строкой' })
  educationElementId: string;

  @IsNumber({}, { message: 'Должно быть числом' })
  order: number;
}

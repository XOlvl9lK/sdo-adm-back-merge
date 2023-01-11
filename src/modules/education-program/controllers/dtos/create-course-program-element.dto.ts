import { IsNumber, IsString } from 'class-validator';

export class CreateCourseProgramElementDto {
  @IsString({ message: 'Должно быть строкой' })
  courseId: string;

  @IsNumber({}, { message: 'Должно быть числом' })
  order: number;
}

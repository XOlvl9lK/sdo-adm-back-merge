import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTestThemeDto {
  @IsString({ message: 'Должно быть строкой' })
  title: string;

  @IsOptional()
  @IsString({ message: 'Должно быть строкой' })
  description?: string;

  @IsOptional()
  @IsNumber({ allowInfinity: false, allowNaN: false }, { message: 'Должно быть числом' })
  questionsToDisplay?: number;
}

export class CreateTestThemeInTestDto extends CreateTestThemeDto {
  @IsString({ message: 'Должно быть строкой' })
  testId: string;
}

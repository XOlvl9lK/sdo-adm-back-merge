import { IsNumber, IsString } from 'class-validator';
import { TestPerformanceEntity } from '@modules/performance/domain/performance.entity';

export class CreateTestAttemptRequestDto {
  @IsString({ message: 'Должно быть строкой' })
  userId: string;

  @IsString({ message: 'Должно быть строкой' })
  testId: string;

  performance: TestPerformanceEntity;

  @IsNumber({ allowNaN: false, allowInfinity: false }, { message: 'Должно быть строкой' })
  passingScore: number;
}

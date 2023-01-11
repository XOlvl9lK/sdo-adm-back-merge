import { IsString } from 'class-validator';
import { CreateQuestionDto } from '@modules/test/controllers/dtos/create-question.dto';

export class CreateChildQuestionDto extends CreateQuestionDto {
  @IsString({ message: 'Должно быть строкой' })
  parentQuestionId: string;
}

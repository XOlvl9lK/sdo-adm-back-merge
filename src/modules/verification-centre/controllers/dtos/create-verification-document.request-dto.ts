import { IsString } from 'class-validator';

export class CreateVerificationDocumentRequestDto {
  @IsString({ message: 'Должно быть строкой' })
  fileId: string;
}

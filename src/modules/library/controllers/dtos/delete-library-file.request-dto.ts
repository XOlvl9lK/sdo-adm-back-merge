import { IsArray } from 'class-validator';

export class DeleteLibraryFileRequestDto {
  @IsArray({ message: 'Должно быть массивом' })
  libraryFileIds: string[];
}

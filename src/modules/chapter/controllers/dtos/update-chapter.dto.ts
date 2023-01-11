import { CreateChapterDto } from '@modules/chapter/controllers/dtos/create-chapter.dto';

export class UpdateChapterDto extends CreateChapterDto {
  id: string;
}

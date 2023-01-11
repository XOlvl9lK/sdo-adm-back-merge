import { CreateNewsGroupDto } from '@modules/news/controllers/dtos/create-news-group.dto';

export class UpdateNewsGroupDto extends CreateNewsGroupDto {
  id: string;
}

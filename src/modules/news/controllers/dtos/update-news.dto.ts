import { CreateNewsRequestDto } from '@modules/news/controllers/dtos/create-news.request-dto';

export class UpdateNewsDto extends CreateNewsRequestDto {
  id: string;
}

export class MoveNewsDto {
  newsIds: string[];
  newsGroupToId: string;
}

import { CreateForumDto } from '@modules/forum/controllers/dtos/create-forum.dto';
import { SingleSortActionTypesEnum } from '@modules/test/controllers/dtos/update-test-theme.dto';

export class UpdateForumDto extends CreateForumDto {
  id: string;
}

export class ChangeForumOrderDto {
  forumId: string;
  sortActionType: SingleSortActionTypesEnum;
}

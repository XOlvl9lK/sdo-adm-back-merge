import { UserEntity } from '@modules/user/domain/user.entity';

export class DibUsersImportEvent {
  constructor(public users: UserEntity[]) {}
}

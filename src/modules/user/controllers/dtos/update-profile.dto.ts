import { GenderEnum } from '@modules/user/domain/user.entity';

export class UpdateProfileDto {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email?: string;
  organization?: string;
  institution?: string;
  gender?: GenderEnum;
  password?: string;
  oldPassword?: string;
}

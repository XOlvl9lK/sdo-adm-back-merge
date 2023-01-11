import { PermissionEnum } from '@modules/user/domain/permission.entity';

export class CreatePermissionDto {
  code: PermissionEnum;
  description?: string;
}

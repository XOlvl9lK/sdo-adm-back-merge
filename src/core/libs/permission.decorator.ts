import { SetMetadata } from '@nestjs/common';
import { PermissionEnum } from '@modules/user/domain/permission.entity';

export const Permission = (...permission: PermissionEnum[]) => SetMetadata('permission', permission);

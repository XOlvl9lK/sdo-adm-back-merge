import { PermissionEnum } from '@modules/user/domain/permission.entity';
import { applyDecorators, UseGuards } from '@nestjs/common';
import { Permission } from '@core/libs/permission.decorator';
import { JwtAuthGuard } from '@modules/user/infrastructure/guards/jwt-auth.guard';
import { PermissionGuard } from '@modules/user/infrastructure/guards/permission.guard';

export const UseAuthPermissions = (...permissions: PermissionEnum[]) =>
  applyDecorators(Permission(...permissions), UseGuards(JwtAuthGuard, PermissionGuard));

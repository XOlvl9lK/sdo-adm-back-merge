import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { PermissionEnum } from '@modules/user/domain/permission.entity';
import { UserException } from '@modules/user/infrastructure/exceptions/user.exception';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const permissions = this.reflector.get<PermissionEnum[]>('permission', context.getHandler());
    if (!permissions?.length) return true;
    const req = context.switchToHttp().getRequest();
    const userPermissions = req?.user?.permissions as PermissionEnum[] | undefined;
    const hasPermissions = this.hasPermissions(permissions, userPermissions);
    if (!hasPermissions) UserException.Forbidden(`Пользователь ${req?.user?.userId}. Недостаточно прав`);
    return true;
  }

  private hasPermissions(permissions: PermissionEnum[], userPermissions?: PermissionEnum[]) {
    if (userPermissions?.length) {
      let bool = false;
      permissions.forEach(p => {
        if (userPermissions.includes(p)) bool = true;
      });
      return bool;
    }
    return false;
  }
}

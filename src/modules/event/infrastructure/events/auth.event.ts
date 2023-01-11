import { PermissionEntity } from '@modules/user/domain/permission.entity';

export enum AuthActionEnum {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
}

export class AuthEvent {
  constructor(public login: string, public action: AuthActionEnum, public permissions?: PermissionEntity[]) {}
}

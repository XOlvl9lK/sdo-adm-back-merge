import { Injectable } from '@nestjs/common';
import { AxiosInstance } from 'axios';

@Injectable()
export class DibAuthService {
  private extServiceUrl = process.env.DIB_AUTH_SERVICE;
  private transport!: AxiosInstance;

  public async getUserInfo(token: string): Promise<{
    permissions: Record<string, string[]>;
    user: {
      allowedAddresses: string[];
      attributes: Record<string, string[]>;
      firstName: string;
      fullName: string;
      id: string;
      inn: string;
      lastName: string;
      patronymic: string;
      remoteIp: string;
      roles: string[];
      snils: string;
      type: string;
      username: string;
    };
  }> {
    const { data } = await this.transport.get(`api/v1/admin/common/token/${token}/user`);
    return data;
  }

  public async getSessionInfo(token: string): Promise<{
    activeSession: string;
    fullName: string;
    id: string;
    ip: string;
    startSession: string;
    username: string;
  }> {
    const { data } = await this.transport.get(`api/v1/admin/common/token/${token}`);
    return data;
  }

  public async getUserPermissions(token: string): Promise<{
    permissions: {
      action: string;
      securityObjectId: string;
    }[];
  }> {
    const { data } = await this.transport.get(`api/v1/admin/common/token/${token}/permissions`);
    return data;
  }

  public async checkToken(token: string): Promise<boolean> {
    const { data } = await this.transport.post(`/api/v1/admin/common/token/check/${token}`);
    return JSON.parse(data);
  }

  public async checkTokenWithoutUpdate(token: string): Promise<boolean> {
    const { data } = await this.transport.get(`/api/v1/admin/common/token/is/actual/${token}`);
    return JSON.parse(data);
  }

  /**
   * @returns неактуальные токены
   */
  public async checkTokens(tokens: string[]): Promise<string[]> {
    const { data } = await this.transport.post(`/api/v1/admin/common/token/not/actual/tokens/get`, tokens);
    return data;
  }

  public async checkUserPermission(token: string, securityObjectId: string, action: string): Promise<boolean> {
    const { data } = await this.transport.get(`/api/v1/admin/common/token/has/permission/${token}`, {
      params: { securityObjectId, action },
    });
    return JSON.parse(data);
  }

  public async checkUserPermissions(
    token: string,
    permissions: Array<{ securityObjectId: string; action: string }>,
  ): Promise<boolean[]> {
    const { data } = await this.transport.post(`/api/v1/admin/common/token/has/permissions/${token}`, permissions);
    return (data as Array<string>).map(e => JSON.parse(e));
  }

  public async hasUserRole(token: string, roleId: string): Promise<boolean> {
    const { data } = await this.transport.get(`api/v1/admin/common/token/has/role/${token}`, {
      params: { roleId },
    });
    return JSON.parse(data);
  }

  public async hasUserRoles(token: string, rolesId: string[]): Promise<boolean[]> {
    const { data } = await this.transport.post(`/api/v1/admin/common/token/has/roles/${token}`, rolesId);
    return (data as Array<string>).map(e => JSON.parse(e));
  }
}

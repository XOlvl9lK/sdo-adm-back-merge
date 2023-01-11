import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PermissionRepository } from '@modules/user/infrastructure/database/permission.repository';
import { RequestQuery } from '@core/libs/types';

@Injectable()
export class FindPermissionService {
  constructor(
    @InjectRepository(PermissionRepository)
    private permissionRepository: PermissionRepository,
  ) {}

  async findAll(requestQuery: RequestQuery) {
    return await this.permissionRepository.findAll(requestQuery);
  }
}

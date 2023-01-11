import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PermissionRepository } from '@modules/user/infrastructure/database/permission.repository';
import { CreatePermissionDto } from '@modules/user/controllers/dtos/create-permission.dto';
import { PermissionException } from '@modules/user/infrastructure/exceptions/permission.exception';
import { PermissionEntity } from '@modules/user/domain/permission.entity';

@Injectable()
export class CreatePermissionService {
  constructor(
    @InjectRepository(PermissionRepository)
    private permissionRepository: PermissionRepository,
  ) {}

  async create({ code, description }: CreatePermissionDto) {
    if (await this.permissionRepository.isAlreadyExists(code)) PermissionException.AlreadyExists();
    const permission = new PermissionEntity(code, description);
    return await this.permissionRepository.save(permission);
  }
}

import { Module } from '@nestjs/common';
import { CreateAuthorityService } from '@modules/authority/application/create-authority.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  DepartmentRepository,
  RegionRepository,
  RoleDibRepository,
  SubdivisionRepository,
} from '@modules/authority/infrastructure/database/authority.repository';
import { AuthorityController } from '@modules/authority/controllers/authority.controller';
import { FindAuthorityService } from '@modules/authority/application/find-authority.service';
import { ImportAuthorityService } from '@modules/authority/application/import-authority.service';
import { UserRepository } from '@modules/user/infrastructure/database/user.repository';

@Module({
  controllers: [AuthorityController],
  providers: [CreateAuthorityService, FindAuthorityService, ImportAuthorityService],
  imports: [
    TypeOrmModule.forFeature([
      DepartmentRepository,
      RegionRepository,
      SubdivisionRepository,
      RoleDibRepository,
      UserRepository,
    ]),
  ],
  exports: [
    ImportAuthorityService
  ]
})
export class AuthorityModule {}

import { Module } from '@nestjs/common';
import { UserController } from 'src/modules/user/controllers/user.controller';
import { CreateUserService } from 'src/modules/user/application/create-user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '@modules/user/infrastructure/database/user.repository';
import { FindUserService } from '@modules/user/application/find-user.service';
import { AuthController } from '@modules/user/controllers/auth.controller';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from '@modules/user/application/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '@modules/user/infrastructure/strategies/jwt.strategy';
import { RoleRepository } from '@modules/user/infrastructure/database/role.repository';
import { RoleController } from '@modules/user/controllers/role.controller';
import { CreateRoleService } from '@modules/user/application/create-role.service';
import { FindRoleService } from '@modules/user/application/find-role.service';
import {
  DepartmentRepository,
  RegionRepository,
  RoleDibRepository,
  SubdivisionRepository,
} from '@modules/authority/infrastructure/database/authority.repository';
import { GroupRepository } from '@modules/group/infrastructure/database/group.repository';
import { UpdateUserService } from '@modules/user/application/update-user.service';
import { UpdateRoleService } from '@modules/user/application/update-role.service';
import { DeleteRoleService } from '@modules/user/application/delete-role.service';
import { PermissionController } from '@modules/user/controllers/permission.controller';
import { CreatePermissionService } from '@modules/user/application/create-permission.service';
import { FindPermissionService } from '@modules/user/application/find-permission.service';
import { PermissionRepository } from '@modules/user/infrastructure/database/permission.repository';
import { SessionRepository } from '@modules/user/infrastructure/database/session.repository';
import { SessionEventHandler } from '@modules/user/application/session.event-handler';
import { ImportDibUserService } from 'src/modules/user/application/import-dib-user.service';
import { ImportUserService } from 'src/modules/user/application/import-user.service';
import { GroupModule } from 'src/modules/group/group.module';

@Module({
  controllers: [UserController, AuthController, RoleController, PermissionController],
  providers: [
    CreateUserService,
    FindUserService,
    AuthService,
    JwtStrategy,
    CreateRoleService,
    FindRoleService,
    UpdateUserService,
    UpdateRoleService,
    DeleteRoleService,
    CreatePermissionService,
    FindPermissionService,
    SessionEventHandler,
    ImportDibUserService,
    ImportUserService,
  ],
  imports: [
    TypeOrmModule.forFeature([
      UserRepository,
      RoleRepository,
      DepartmentRepository,
      RegionRepository,
      SubdivisionRepository,
      RoleDibRepository,
      GroupRepository,
      PermissionRepository,
      SessionRepository,
    ]),
    PassportModule,
    JwtModule.register({}),
    GroupModule,
  ],
})
export class UserModule {}

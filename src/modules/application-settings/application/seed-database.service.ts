import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import {
  ApplicationSettingsRepository
} from '@modules/application-settings/infrastructure/application-settings.repository';
import { PermissionEntity } from '@modules/user/domain/permission.entity';
import {
  admin,
  adminRole,
  basicChapter,
  basicChapterId,
  certificateIssuance, contactsPage,
  isApplicationSeeded,
  listenerRole, mainPage,
  maxExportWorkers,
  permissions,
  sdo
} from '@modules/application-settings/infrastructure/seed-data';
import { RoleEntity } from '@modules/user/domain/role.entity';
import { UserEntity } from '@modules/user/domain/user.entity';
import { ChapterEntity } from '@modules/chapter/domain/chapter.entity';
import { ApplicationSettingsEntity } from '@modules/application-settings/domain/application-settings.entity';
import { ImportAuthorityService } from '@modules/authority/application/import-authority.service';
import {
  DepartmentRepository,
  RegionRepository,
  SubdivisionRepository
} from '@modules/authority/infrastructure/database/authority.repository';
import { AuthorityEnum } from '@modules/authority/domain/authority.enum';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { PageContentEntity } from '@modules/html/domain/page-content.entity';
import { ChapterRepository } from '@modules/chapter/infrastructure/database/chapter.repository';

@Injectable()
export class SeedDatabaseService implements OnApplicationBootstrap {
  private departmentsPath = join(process.cwd(), 'src', 'modules', 'authority', 'infrastructure', 'static', 'departments.xlsx')
  private regionsPath = join(process.cwd(), 'src', 'modules', 'authority', 'infrastructure', 'static', 'regions.xlsx')
  private subdivisionsPath = join(process.cwd(), 'src', 'modules', 'authority', 'infrastructure', 'static', 'subdivisions.xlsx')

  constructor(
    @InjectConnection()
    private connection: Connection,
    @InjectRepository(ApplicationSettingsRepository)
    private applicationSettingsRepository: ApplicationSettingsRepository,
    @InjectRepository(DepartmentRepository)
    private departmentRepository: DepartmentRepository,
    @InjectRepository(RegionRepository)
    private regionRepository: RegionRepository,
    @InjectRepository(SubdivisionRepository)
    private subdivisionRepository: SubdivisionRepository,
    @InjectRepository(ChapterRepository)
    private chapterRepository: ChapterRepository,
    private importAuthorityService: ImportAuthorityService
  ) {}

  async onApplicationBootstrap() {
    if (!await this.applicationSettingsRepository.isDataSeeded()) {
      await this.connection.createQueryBuilder().insert().into(PermissionEntity).values(permissions).execute();
      await this.connection.createQueryBuilder().insert().into(RoleEntity).values([adminRole, listenerRole]).execute();
      await this.connection
        .createQueryBuilder()
        .insert()
        .into('role_permissions_permission')
        .values(
          permissions.map(p => ({
            roleId: adminRole.id,
            permissionId: p.id,
          })),
        )
        .execute();
      await this.connection.createQueryBuilder().insert().into(UserEntity).values([admin, sdo]).execute();
      await this.connection.createQueryBuilder().insert().into(ChapterEntity).values(basicChapter).execute();
      await this.connection
        .createQueryBuilder()
        .insert()
        .into(ApplicationSettingsEntity)
        .values([certificateIssuance, basicChapterId, maxExportWorkers, isApplicationSeeded])
        .execute();
      await this.connection
        .createQueryBuilder()
        .insert()
        .into(PageContentEntity)
        .values([mainPage, contactsPage])
        .execute()
    }
    if (await this.departmentRepository.isEmpty() && existsSync(this.departmentsPath)) {
      const buffer = readFileSync(this.departmentsPath)
      await this.importAuthorityService.import(AuthorityEnum.DEPARTMENT, { buffer })
    }
    if (await this.regionRepository.isEmpty() && existsSync(this.regionsPath)) {
      const buffer = readFileSync(this.regionsPath)
      await this.importAuthorityService.import(AuthorityEnum.REGION, { buffer })
    }
    if (await this.subdivisionRepository.isEmpty() && existsSync(this.subdivisionsPath)) {
      const buffer = readFileSync(this.subdivisionsPath)
      await this.importAuthorityService.import(AuthorityEnum.SUBDIVISION, { buffer })
    }
  }
}
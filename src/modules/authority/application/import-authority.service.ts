import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DepartmentRepository,
  RegionRepository,
  RoleDibRepository,
  SubdivisionRepository,
} from '@modules/authority/infrastructure/database/authority.repository';
import { AuthorityEnum } from '@modules/authority/domain/authority.enum';
import * as ExcelJs from 'exceljs';
import { DepartmentEntity } from '@modules/authority/domain/department.entity';
import { RegionEntity } from '@modules/authority/domain/region.entity';
import { RoleDibEntity } from '@modules/authority/domain/role-dib.entity';
import { SubdivisionEntity } from '@modules/authority/domain/subdivision.entity';
import { UserRepository } from '@modules/user/infrastructure/database/user.repository';
import { ProgramSettingRepository } from '@modules/program-settings/infrastructure/database/program-setting.repository';
import { AuthorityException } from '@modules/authority/infrastructure/exceptions/authority.exception';

interface ParsedAuthority {
  foreignId: string;
  title: string;
}

@Injectable()
export class ImportAuthorityService {
  constructor(
    @InjectRepository(DepartmentRepository)
    private departmentRepository: DepartmentRepository,
    @InjectRepository(RegionRepository)
    private regionRepository: RegionRepository,
    @InjectRepository(SubdivisionRepository)
    private subdivisionRepository: SubdivisionRepository,
    @InjectRepository(RoleDibRepository)
    private roleDibRepository: RoleDibRepository,
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  async import<File extends { buffer: Buffer }>(authority: AuthorityEnum, file: File) {
    if (await this.userRepository.hasAuthorityReference(authority)) AuthorityException.ImportRestricted()
    const workbook = new ExcelJs.Workbook();
    await workbook.xlsx.load(file.buffer);
    const sheet = workbook.getWorksheet(1);
    const foreignIdColumn = authority === AuthorityEnum.SUBDIVISION ? 6 : 5;
    const titleColumn = authority === AuthorityEnum.REGION ? 14 : authority === AuthorityEnum.DEPARTMENT ? 8 : 9;
    let i = 10;
    let row = sheet.getRow(i);
    const parsedAuthority: ParsedAuthority[] = [];
    while (row.values[foreignIdColumn] && row.values[titleColumn]) {
      parsedAuthority.push({
        foreignId: row.values[foreignIdColumn],
        title: row.values[titleColumn],
      });
      i++;
      row = sheet.getRow(i);
    }
    switch (authority) {
      case AuthorityEnum.DEPARTMENT:
        const departments = parsedAuthority.map(a => new DepartmentEntity(a.title, a.foreignId));
        return await this.departmentRepository.save(departments);
      case AuthorityEnum.REGION:
        const regions = parsedAuthority.map(a => new RegionEntity(a.title, a.foreignId));
        return await this.regionRepository.save(regions);
      case AuthorityEnum.ROLE_DIB:
        const rolesDib = parsedAuthority.map(a => new RoleDibEntity(a.title, a.foreignId));
        return await this.roleDibRepository.save(rolesDib);
      case AuthorityEnum.SUBDIVISION:
        const subdivisions = parsedAuthority.map(a => new SubdivisionEntity(a.title, a.foreignId));
        return await this.subdivisionRepository.save(subdivisions);
    }
  }
}

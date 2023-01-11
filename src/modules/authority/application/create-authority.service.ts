import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DepartmentRepository,
  RegionRepository,
  RoleDibRepository,
  SubdivisionRepository,
} from '@modules/authority/infrastructure/database/authority.repository';
import { CreateAuthorityRequestDto } from '@modules/authority/controllers/dtos/create-authority.request-dto';
import { DepartmentEntity } from '@modules/authority/domain/department.entity';
import { RegionEntity } from '@modules/authority/domain/region.entity';
import { SubdivisionEntity } from '@modules/authority/domain/subdivision.entity';
import { RoleDibEntity } from '@modules/authority/domain/role-dib.entity';

@Injectable()
export class CreateAuthorityService {
  constructor(
    @InjectRepository(DepartmentRepository)
    private departmentRepository: DepartmentRepository,
    @InjectRepository(RegionRepository)
    private regionRepository: RegionRepository,
    @InjectRepository(SubdivisionRepository)
    private subdivisionRepository: SubdivisionRepository,
    @InjectRepository(RoleDibRepository)
    private roleDibRepository: RoleDibRepository,
  ) {}

  async createDepartment({ title }: CreateAuthorityRequestDto) {
    const department = new DepartmentEntity(title, '');
    return await this.departmentRepository.save(department);
  }

  async createRegion({ title }: CreateAuthorityRequestDto) {
    const region = new RegionEntity(title, '');
    return await this.regionRepository.save(region);
  }

  async createSubdivision({ title }: CreateAuthorityRequestDto) {
    const subdivision = new SubdivisionEntity(title, '');
    return await this.subdivisionRepository.save(subdivision);
  }

  async createRoleDib({ title }: CreateAuthorityRequestDto) {
    const roleDib = new RoleDibEntity(title, '');
    return await this.roleDibRepository.save(roleDib);
  }
}

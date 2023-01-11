import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DepartmentRepository,
  RegionRepository,
  RoleDibRepository,
  SubdivisionRepository,
} from '@modules/authority/infrastructure/database/authority.repository';
import { RequestQuery } from '@core/libs/types';

@Injectable()
export class FindAuthorityService {
  constructor(
    @InjectRepository(RoleDibRepository)
    private roleDibRepository: RoleDibRepository,
    @InjectRepository(DepartmentRepository)
    private departmentRepository: DepartmentRepository,
    @InjectRepository(SubdivisionRepository)
    private subdivisionRepository: SubdivisionRepository,
    @InjectRepository(RegionRepository)
    private regionRepository: RegionRepository,
  ) {}

  async findRoleDib(requestQuery: RequestQuery) {
    return await this.roleDibRepository.findAll(requestQuery);
  }

  async getAvailableRolesForProgramSettings(search: string) {
    return await this.roleDibRepository.findAvailableRolesForProgramSettings(search);
  }

  async findDepartment(requestQuery: RequestQuery) {
    return await this.departmentRepository.findAll(requestQuery);
  }

  async findSubdivision(requestQuery: RequestQuery) {
    return await this.subdivisionRepository.findAll(requestQuery);
  }

  async findSubdivisionById(id: string) {
    return await this.subdivisionRepository.findById(id);
  }

  async findRegion(requestQuery: RequestQuery) {
    return await this.regionRepository.findAll(requestQuery);
  }

  async findRegionById(id: string) {
    return await this.regionRepository.findById(id);
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EducationElementRepository } from '@modules/education-program/infrastructure/database/education-program.repository';
import { RequestQuery } from '@core/libs/types';
import { ProgramSettingRepository } from '@modules/program-settings/infrastructure/database/program-setting.repository';

@Injectable()
export class FindEducationElementService {
  constructor(
    @InjectRepository(EducationElementRepository)
    private educationElementRepository: EducationElementRepository,
    private programSettingRepository: ProgramSettingRepository
  ) {}

  async findAll(requestQuery: RequestQuery) {
    return await this.educationElementRepository.findAll(requestQuery);
  }

  async findForDibSettings(id: string, type: 'optional' | 'obligatory', requestQuery: RequestQuery) {
    const programSettings = await this.programSettingRepository.findById(id)
    let ids: string[]
    if (type === 'optional') {
      ids = programSettings.obligatory.map(el => el.id)
    } else {
      ids = programSettings.optional.map(el => el.id)
    }
    return this.educationElementRepository.findAllExcludeIds(ids, requestQuery)
  }
}

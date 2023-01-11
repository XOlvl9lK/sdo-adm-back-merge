import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TestSettingsRepository } from '@modules/education-program/infrastructure/database/test-settings.repository';

@Injectable()
export class FindTestSettingsService {
  constructor(
    @InjectRepository(TestSettingsRepository)
    private testSettingsRepository: TestSettingsRepository,
  ) {}

  async findById(id: string) {
    return await this.testSettingsRepository.findById(id);
  }
}

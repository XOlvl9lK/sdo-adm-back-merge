import { Controller, Param, Post } from '@nestjs/common';
import { SeedDatabaseService } from '@modules/application-settings/application/seed-database.service';

@Controller('seed-database')
export class SeedDatabaseController {
  constructor(
    private seedDatabaseService: SeedDatabaseService
  ) {}

  @Post(':method')
  async seedData(@Param('method') method: string) {
    await this.seedDatabaseService[method]?.()
    return { success: true }
  }
}

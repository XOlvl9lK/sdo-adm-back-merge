import { Controller, Get, Query } from '@nestjs/common';
import { FindApplicationSettingsService } from '@modules/application-settings/application/find-application-settings.service';

@Controller('application-settings')
export class ApplicationSettingsController {
  constructor(private findApplicationSettingsService: FindApplicationSettingsService) {}

  @Get()
  async getByTitle(@Query('title') titles: string | string[]) {
    const titlesArr = Array.isArray(titles) ? titles : [titles]
    return await this.findApplicationSettingsService.findByTitle(titlesArr);
  }
}

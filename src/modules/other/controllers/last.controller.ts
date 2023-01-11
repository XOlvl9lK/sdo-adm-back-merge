import { Controller, Get } from '@nestjs/common';
import { FindLastService } from '@modules/other/application/find-last.service';

@Controller('last')
export class LastController {
  constructor(private findLastService: FindLastService) {}

  @Get()
  async getLast() {
    return await this.findLastService.getLast();
  }
}

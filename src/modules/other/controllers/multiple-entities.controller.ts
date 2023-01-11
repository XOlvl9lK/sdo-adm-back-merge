import { Controller, Get, Query } from '@nestjs/common';
import { FindMultipleEntitiesService } from '@modules/other/application/find-multiple-entities.service';
import { RequestQuery } from '@core/libs/types';

@Controller('multiple')
export class MultipleEntitiesController {
  constructor(private findMultipleEntitiesService: FindMultipleEntitiesService) {}

  @Get('for-education-request')
  async getAllGroupsAndUsers(@Query() requestQuery: RequestQuery) {
    const [data, total] = await this.findMultipleEntitiesService.findAllGroupsAndUsers(requestQuery);
    return { data, total: total[0].count };
  }
}

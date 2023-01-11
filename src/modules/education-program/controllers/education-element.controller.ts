import { Controller, Get, Param, Query } from '@nestjs/common';
import { FindEducationElementService } from '@modules/education-program/application/find-education-element.service';
import { RequestQuery } from '@core/libs/types';
import { UseAuthPermissions } from '@core/libs/use-auth-permissions.decorator';

@Controller('education-element')
export class EducationElementController {
  constructor(private findEducationElementService: FindEducationElementService) {}

  @UseAuthPermissions()
  @Get()
  async getAll(@Query() requestQuery: RequestQuery) {
    const [data, total] = await this.findEducationElementService.findAll(requestQuery);
    return {
      total,
      data,
    };
  }

  @UseAuthPermissions()
  @Get('for-dib/:id')
  async getForDibEducationSettings(@Param('id') id: string, @Query() requestQuery: RequestQuery & { type: 'optional' | 'obligatory' }) {
    const [data, total] = await this.findEducationElementService.findForDibSettings(id, requestQuery.type, requestQuery)
    return { data, total }
  }
}

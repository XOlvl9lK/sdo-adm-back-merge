import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { FindProgramElementService } from '@modules/education-program/application/find-program-element.service';
import { RequestQuery } from '@core/libs/types';
import { Page } from '@core/libs/page.decorator';
import { UnStrictJwtAuthGuard } from '@modules/user/infrastructure/guards/unstrict-jwt-auth.guard';
import { UserId } from '@core/libs/user-id.decorator';

@Controller('program-element')
export class ProgramElementController {
  constructor(private findEducationElementService: FindProgramElementService) {}

  @Get()
  async getAll(@Query() requestQuery: RequestQuery) {
    const [elements, total] = await this.findEducationElementService.findAll(requestQuery);
    return {
      total,
      data: elements,
    };
  }

  @Page('Программы обучения')
  @UseGuards(UnStrictJwtAuthGuard)
  @Get('course/:id')
  async getCourseProgramElementById(@Param('id') id: string, @UserId() userId?: string) {
    return await this.findEducationElementService.findCourseProgramElementById(id, userId);
  }

  @Page('Программы обучения')
  @UseGuards(UnStrictJwtAuthGuard)
  @Get('test/:id')
  async getTestProgramElementById(@Param('id') id: string, @Query() requestQuery: RequestQuery, @UserId() userId?: string) {
    return await this.findEducationElementService.findTestProgramElementById(id, requestQuery, userId);
  }
}

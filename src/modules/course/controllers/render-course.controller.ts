import { Controller, Get, Param, Render, Req } from '@nestjs/common';
import { Request } from 'express';

@Controller('render')
export class RenderCourseController {
  @Get(':id/:userId/:performanceId')
  @Render('index')
  async root(@Param('id') id: string, @Req() request: Request) {
    const arr = request.rawHeaders.find(h => h.includes('http')).split(':');

    const domain = arr[0] + '://' + (arr[1] + '').replaceAll('/', '') + ':' + (process.env.PORT || 3001);
    return { domain, arr: JSON.stringify(arr) };
  }
}

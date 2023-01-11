import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';

@Controller('scorm-api')
export class ScormApiController {
  private scormApiDirectory = join(process.cwd(), 'static', 'scorm-api');

  @Get(':fileName')
  async getStaticFile(@Param('fileName') fileName: string, @Res() response: Response) {
    response.sendFile(join(this.scormApiDirectory, fileName));
  }
}

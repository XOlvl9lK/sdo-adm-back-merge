import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CourseSuspendDataService } from '@modules/course/application/course-suspend-data.service';
import { CreateSuspendDataDto } from '@modules/course/controllers/dtos/create-suspend-data.dto';

@Controller('course-suspend-data')
export class CourseSuspendDataController {
  constructor(private courseSuspendDataService: CourseSuspendDataService) {}

  @Get()
  async getByUserIdAndAttemptId(@Query('userId') userId: string, @Query('attemptId') attemptId: string) {
    const data = await this.courseSuspendDataService.findByUserIdAndAttemptId(attemptId);
    return {
      data,
      success: true,
    };
  }

  @Post()
  async createOrUpdate(@Body() suspendDataDto: CreateSuspendDataDto) {
    return await this.courseSuspendDataService.createOrUpdatedSuspendData(suspendDataDto);
  }
}

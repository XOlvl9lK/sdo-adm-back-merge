import { Controller, Get, Param, Query, Req, Res } from '@nestjs/common';
import { FindPerformanceService } from '@modules/performance/application/find-performance.service';
import { RequestQuery } from '@core/libs/types';
import { UserId } from '@core/libs/user-id.decorator';
import { Page } from '@core/libs/page.decorator';
import { PermissionEnum } from '@modules/user/domain/permission.entity';
import { Request, Response } from 'express';
import { GeneratePerformanceCertificateService } from 'src/modules/performance/application/generate-perfomance-certificate.service';
import { UseAuthPermissions } from '@core/libs/use-auth-permissions.decorator';

@Controller('performance')
export class PerformanceController {
  constructor(
    private findPerformanceService: FindPerformanceService,
    private generatePerformanceCertificateService: GeneratePerformanceCertificateService,
  ) {}

  @Page('Успеваемость')
  @UseAuthPermissions(PermissionEnum.PERFORMANCE)
  @Get()
  async getUserPerformance(@UserId() userId: string, @Query() requestQuery: RequestQuery) {
    const [data, total] = await this.findPerformanceService.findByUser(userId, requestQuery);
    const newData = data.map(d => {
      return {
        ...d,
        canRun: d.canRun,
      };
    });
    return { data: newData, total };
  }

  @Page('Моё расписание')
  @UseAuthPermissions(PermissionEnum.TIMETABLE)
  @Get('timetable')
  async getTimeTable(@UserId() userId: string, @Query() requestQuery: RequestQuery) {
    const [data, total] = await this.findPerformanceService.findUserTimeTable(userId, requestQuery);
    return { total, data };
  }

  @Page('Моё расписание')
  @UseAuthPermissions(PermissionEnum.TIMETABLE)
  @Get('run-course/:id')
  async runCourse(@Param('id') id: string, @UserId() userId: string) {
    return await this.findPerformanceService.runCourse(id, userId);
  }

  @Page('Моё расписание')
  @UseAuthPermissions(PermissionEnum.TIMETABLE)
  @Get('run-program/:id')
  async runEducationProgram(@Param('id') id: string, @Query() requestQuery: RequestQuery, @UserId() userId: string) {
    return await this.findPerformanceService.runEducationProgram(id, requestQuery, userId);
  }

  @Page('Успеваемость')
  @UseAuthPermissions(PermissionEnum.PERFORMANCE)
  @Get('test/:id')
  async getUserTestPerformanceById(
    @Param('id') id: string,
    @Query() requestQuery: RequestQuery,
    @UserId() userId: string,
  ) {
    return this.findPerformanceService.findUserTestPerformanceById(id, requestQuery, userId);
  }

  @Page('Моё расписание')
  @UseAuthPermissions(PermissionEnum.TIMETABLE)
  @Get('test-attempt/:id')
  async getTestAttemptById(@Param('id') id: string) {
    return await this.findPerformanceService.findTestAttemptById(id);
  }

  @Page('Моё расписание')
  @UseAuthPermissions(PermissionEnum.TIMETABLE)
  @Get('view-answers/:id')
  async getTestAttemptForViewAnswers(@Param('id') id: string) {
    return await this.findPerformanceService.findTestAttemptForViewAnswers(id);
  }

  @Page('Успеваемость')
  @UseAuthPermissions(PermissionEnum.PERFORMANCE)
  @Get('course/:id')
  async getCoursePerformanceById(
    @Param('id') id: string,
    @Query() requestQuery: RequestQuery,
    @UserId() userId: string,
  ) {
    return await this.findPerformanceService.findCoursePerformanceById(id, requestQuery, userId);
  }

  @Get('course/unauthorized/:id')
  async getCoursePerformanceByIdUnauthorized(@Param('id') id: string, @Query() requestQuery: RequestQuery) {
    return await this.findPerformanceService.findCoursePerformanceById(id, requestQuery);
  }

  @Page('Успеваемость')
  @UseAuthPermissions(PermissionEnum.PERFORMANCE)
  @Get('program/:id')
  async getProgramPerformanceById(
    @Param('id') id: string,
    @Query() requestQuery: RequestQuery,
    @UserId() userId: string,
  ) {
    return await this.findPerformanceService.findProgramPerformanceById(id, requestQuery, userId);
  }

  @Get('certificate/:id')
  async generateCertificate(@Param('id') id: string, @Res() response: Response, @Req() request: Request) {
    const arr = request.rawHeaders.find(h => h.includes('http')).split(':');
    const domain = arr[0] + '://' + arr[1].replaceAll('/', '') + ':' + (process.env.PORT || 3001);
    return await this.generatePerformanceCertificateService.handle(id, response, domain);
  }
}

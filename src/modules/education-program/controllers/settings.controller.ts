import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { CreateTestSettingsService } from '@modules/education-program/application/create-test-settings.service';
import { FindTestSettingsService } from '@modules/education-program/application/find-test-settings.service';
import { UpdateTestSettingsService } from '@modules/education-program/application/update-test-settings.service';
import { UpdateTestSettingsDto } from '@modules/education-program/controllers/dtos/update-test-settings.dto';
import { UpdateCourseSettingsService } from '@modules/education-program/application/update-course-settings.service';
import { UpdateCourseSettingsDto } from '@modules/education-program/controllers/dtos/update-course-settings.dto';
import { FindCourseSettingsService } from '@modules/education-program/application/find-course-settings.service';
import { FindEducationProgramSettingsService } from '@modules/education-program/application/find-education-program-settings.service';
import { UpdateEducationProgramSettingsService } from '@modules/education-program/application/update-education-program-settings.service';
import { UpdateEducationProgramSettingsDto } from '@modules/education-program/controllers/dtos/update-education-program-settings.dto';
import { JwtAuthGuard } from '@modules/user/infrastructure/guards/jwt-auth.guard';
import { UserId } from '@core/libs/user-id.decorator';

@Controller('settings')
export class SettingsController {
  constructor(
    private findTestSettingsService: FindTestSettingsService,
    private updateTestSettingsService: UpdateTestSettingsService,
    private updateCourseSettingsService: UpdateCourseSettingsService,
    private findCourseSettingsService: FindCourseSettingsService,
    private findEducationProgramSettingsService: FindEducationProgramSettingsService,
    private updateEducationProgramSettingsService: UpdateEducationProgramSettingsService,
  ) {}

  @Get('test/:id')
  async getTestSettingsById(@Param('id') id: string) {
    return await this.findTestSettingsService.findById(id);
  }

  @Get('course/:id')
  async getCourseSettingsById(@Param('id') id: string) {
    return await this.findCourseSettingsService.findById(id);
  }

  @Get('education-program/:id')
  async getEducationProgramSettingsById(@Param('id') id: string) {
    return await this.findEducationProgramSettingsService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('test')
  async updateTestSettings(@Body() testSettingsDto: UpdateTestSettingsDto, @UserId() userId: string) {
    return await this.updateTestSettingsService.update(testSettingsDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('course')
  async updateCourseSettings(@Body() courseSettingsDto: UpdateCourseSettingsDto, @UserId() userId: string) {
    return await this.updateCourseSettingsService.update(courseSettingsDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('education-program')
  async updateEducationProgramSettings(
    @Body() educationProgramSettingsDto: UpdateEducationProgramSettingsDto,
    @UserId() userId: string,
  ) {
    return await this.updateEducationProgramSettingsService.update(educationProgramSettingsDto, userId);
  }
}

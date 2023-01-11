import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateCourseService } from '@modules/course/application/create-course.service';
import { CreateCourseDto } from '@modules/course/controllers/dtos/create-course.dto';
import { FindCourseService } from '@modules/course/application/find-course.service';
import { DeleteCourseService } from '@modules/course/application/delete-course.service';
import { JwtAuthGuard } from '@modules/user/infrastructure/guards/jwt-auth.guard';
import { IPaginatedResponse, RequestQuery } from '@core/libs/types';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateCourseDto } from 'src/modules/course/controllers/dtos/update-course.dto';
import { UpdateCourseService } from 'src/modules/course/application/update-course.service';
import { SubmitCourseService } from '@modules/course/application/submit-course.service';
import { CourseEntity } from '@modules/course/domain/course.entity';
import { UserId } from '@core/libs/user-id.decorator';
import { UnStrictJwtAuthGuard } from '@modules/user/infrastructure/guards/unstrict-jwt-auth.guard';
import { Page } from '@core/libs/page.decorator';
import { RunCourseDto } from '@modules/performance/controllers/dtos/run-course.dto';
import { RunCourseService } from '@modules/course/application/run-course.service';
import { ScormValidationPipe } from '@modules/course/infrastructure/scorm-validation.pipe';

@Controller('course')
export class CourseController {
  constructor(
    private createCourseService: CreateCourseService,
    private findCourseService: FindCourseService,
    private deleteCourseService: DeleteCourseService,
    private updateCourseService: UpdateCourseService,
    private submitCourseService: SubmitCourseService,
    private runCourseService: RunCourseService,
  ) {}

  @Page('Курсы дистанционного обучения')
  @UseGuards(UnStrictJwtAuthGuard)
  @Get()
  async getAll(@Query() requestQuery: RequestQuery): Promise<IPaginatedResponse<CourseEntity[]>> {
    const [courses, total] = await this.findCourseService.findAll(requestQuery);
    return {
      total,
      data: courses,
    };
  }

  @Page('Курсы дистанционного обучения')
  @UseGuards(UnStrictJwtAuthGuard)
  @Get(':id')
  async getById(@Param('id') id: string, @UserId() userId?: string) {
    return this.findCourseService.findById(id, userId);
  }

  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() courseDto: CreateCourseDto,
    @UploadedFile(new ScormValidationPipe()) file: Express.Multer.File,
    @UserId() userId: string,
  ) {
    return await this.createCourseService.create(courseDto, userId, file);
  }

  @Post('submit/:performanceId/:userId')
  async submit(@Param('performanceId') performanceId: string, @Param('userId') userId: string) {
    return await this.submitCourseService.submit(performanceId, userId);
  }

  @Page('Моё расписание')
  @Post('run-attempt')
  async runCourseAttempt(@Body() courseDto: RunCourseDto) {
    return await this.runCourseService.runCourseAttempt(courseDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  async update(@Body() courseDto: UpdateCourseDto, @UserId() userId: string) {
    return await this.updateCourseService.update(courseDto, userId);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.deleteCourseService.delete(id);
  }
}

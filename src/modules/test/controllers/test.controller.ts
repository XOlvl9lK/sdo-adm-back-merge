import { Body, Controller, Delete, Get, Param, Post, Put, Query, Res, UseGuards } from '@nestjs/common';
import { FindTestService } from '@modules/test/application/find-test.service';
import { CreateTestService } from '@modules/test/application/create-test.service';
import { CreateTestDto } from '@modules/test/controllers/dtos/create-test.dto';
import { DeleteTestService } from '@modules/test/application/delete-test.service';
import { JwtAuthGuard } from '@modules/user/infrastructure/guards/jwt-auth.guard';
import { RequestQuery } from '@core/libs/types';
import { SubmitTestService } from '@modules/test/application/submit-test.service';
import { UpdateTestService } from '@modules/test/application/update-test.service';
import { UpdateTestDto } from 'src/modules/test/controllers/dtos/update-test.dto';
import { UserId } from '@core/libs/user-id.decorator';
import { Page } from '@core/libs/page.decorator';
import { UnStrictJwtAuthGuard } from '@modules/user/infrastructure/guards/unstrict-jwt-auth.guard';
import { RunTestService } from '@modules/test/application/run-test.service';
import { TestAttemptSessionService } from '@modules/test/application/test-attempt-session.service';
import { Response } from 'express';
import { PermissionEnum } from '@modules/user/domain/permission.entity';
import { RunTestAttemptDto } from '@modules/test/controllers/dtos/run-test-attempt.dto';
import { UseAuthPermissions } from '@core/libs/use-auth-permissions.decorator';

@Controller('test')
export class TestController {
  constructor(
    private findTestService: FindTestService,
    private createTestService: CreateTestService,
    private deleteTestService: DeleteTestService,
    private submitTestService: SubmitTestService,
    private updateTestService: UpdateTestService,
    private runTestService: RunTestService,
    private testAttemptSessionService: TestAttemptSessionService,
  ) {}

  @Page('Тесты')
  @UseGuards(UnStrictJwtAuthGuard)
  @Get()
  async getAll(@Query() requestQuery: RequestQuery) {
    const [tests, total] = await this.findTestService.findAll(requestQuery);
    return {
      total,
      data: tests,
    };
  }

  @Page('Тесты')
  @UseGuards(UnStrictJwtAuthGuard)
  @Get(':id')
  async getById(@Param('id') id: string, @Query() requestQuery: RequestQuery, @UserId() userId?: string) {
    return await this.findTestService.findById(id, requestQuery, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('run-test/:id')
  async runTest(@Param('id') id: string, @UserId() userId: string, @Query('inProgram') inProgram: boolean) {
    return await this.runTestService.runTest(id, userId);
  }

  @UseAuthPermissions(PermissionEnum.TEST_ATTEMPT)
  @Get('run-test-attempt/:id')
  async runTestAttempt(@Param('id') id: string, @Query() testAttemptSettings: RunTestAttemptDto) {
    return await this.runTestService.runTestAttempt(id, testAttemptSettings);
  }

  @UseGuards(JwtAuthGuard)
  @Get('run-test-attempt-in-program/:id')
  async runTestAttemptInProgram(@Param('id') id: string) {
    return await this.runTestService.runTestAttemptInProgram(id);
  }

  @Get('attempt-session/:attemptId')
  async establishSession(@Param('attemptId') attemptId: string, @Res() response: Response) {
    return await this.testAttemptSessionService.establishSession(attemptId, response);
  }

  @UseAuthPermissions(PermissionEnum.TEST_CREATE)
  @Post()
  async create(@Body() testDto: CreateTestDto, @UserId() userId: string) {
    return await this.createTestService.create(testDto, userId);
  }

  @UseAuthPermissions(PermissionEnum.TEST_EDIT)
  @Put()
  async update(@Body() dto: UpdateTestDto, @UserId() userId: string) {
    return await this.updateTestService.update(dto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('submit/:performanceId')
  async submit(@Param('performanceId') performanceId: string, @UserId() userId: string) {
    return await this.submitTestService.submit(performanceId, userId);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.deleteTestService.delete(id);
  }
}

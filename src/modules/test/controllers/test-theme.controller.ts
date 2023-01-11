import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { CreateTestThemeService } from '@modules/test/application/create-test-theme.service';
import { CreateTestThemeDto, CreateTestThemeInTestDto } from '@modules/test/controllers/dtos/create-test-theme.dto';
import { FindTestThemeService } from '@modules/test/application/find-test-theme.service';
import { ChangeOrderThemeInTestDto, UpdateTestThemeDto } from '@modules/test/controllers/dtos/update-test-theme.dto';
import { UpdateTestThemeService } from '@modules/test/application/update-test-theme.service';
import { AddQuestionsToThemeDto, MoveQuestionsDto } from '@modules/test/controllers/dtos/add-questions-to-theme.dto';
import { IPaginatedResponse, RequestQuery } from '@core/libs/types';
import { GetTestThemeByIdsDto } from '@modules/test/controllers/dtos/get-test-theme-by-ids.dto';
import { JwtAuthGuard } from '@modules/user/infrastructure/guards/jwt-auth.guard';
import { UserId } from '@core/libs/user-id.decorator';
import { TestThemeEntity } from '@modules/test/domain/test-theme.entity';
import { Page } from '@core/libs/page.decorator';
import { PermissionEnum } from '@modules/user/domain/permission.entity';
import { UseAuthPermissions } from '@core/libs/use-auth-permissions.decorator';

@Controller('test-theme')
export class TestThemeController {
  constructor(
    private createTestThemeService: CreateTestThemeService,
    private findTestThemeService: FindTestThemeService,
    private updateTestThemeService: UpdateTestThemeService,
  ) {}

  @Page('Банк вопросов')
  @Get('question-bank/:id')
  @UseAuthPermissions(PermissionEnum.QUESTION_BANK)
  async getThemeByIdFromQuestionBank(@Param('id') id: string, @Query() requestQuery: RequestQuery) {
    return await this.findTestThemeService.findByIdForQuestionBank(id, requestQuery);
  }

  @Page('Тесты')
  @Get('in-test/:id')
  @UseAuthPermissions(PermissionEnum.QUESTION_BANK)
  async getThemeInTestById(@Param('id') id: string, @Query() requestQuery: RequestQuery) {
    return await this.findTestThemeService.findThemeInTestById(id, requestQuery);
  }

  @Page('Банк вопросов')
  @UseAuthPermissions(PermissionEnum.QUESTION_BANK)
  @Get()
  async getAll(@Query() requestQuery: RequestQuery): Promise<IPaginatedResponse<TestThemeEntity[]>> {
    const [testThemes, total] = await this.findTestThemeService.findQuestionBank(requestQuery);
    return {
      total,
      data: testThemes,
    };
  }

  @Get(':id')
  async getById(@Param('id') id: string, @Query() requestQuery: RequestQuery) {
    return await this.findTestThemeService.findById(id, requestQuery);
  }

  @Post('by-ids')
  async getByIds(@Body() testThemeDto: GetTestThemeByIdsDto) {
    return await this.findTestThemeService.findByIds(testThemeDto);
  }

  @UseAuthPermissions(PermissionEnum.QUESTION_BANK_CREATE)
  @Post()
  async create(@Body() testThemeDto: CreateTestThemeDto, @UserId() userId: string) {
    return await this.createTestThemeService.create(testThemeDto, userId);
  }

  @UseAuthPermissions(PermissionEnum.QUESTION_BANK_CREATE)
  @UseGuards(JwtAuthGuard)
  @Post('in-test')
  async createInTest(@Body() testThemeDto: CreateTestThemeInTestDto, @UserId() userId: string) {
    return await this.createTestThemeService.createInTest(testThemeDto, userId);
  }

  @UseAuthPermissions(PermissionEnum.QUESTION_BANK_EDIT)
  @Put()
  async update(@Body() testThemeDto: UpdateTestThemeDto, @UserId() userId: string) {
    return await this.updateTestThemeService.update(testThemeDto, userId);
  }

  @UseAuthPermissions(PermissionEnum.QUESTION_BANK_EDIT)
  @Put('order')
  async changeOrder(@Body() testThemeDto: ChangeOrderThemeInTestDto, @UserId() userId: string) {
    return await this.updateTestThemeService.changeOrder(testThemeDto, userId);
  }

  @UseAuthPermissions(PermissionEnum.QUESTION_BANK_EDIT)
  @Put('move-questions')
  async moveQuestions(@Body() moveQuestionsDto: MoveQuestionsDto) {
    return await this.updateTestThemeService.moveToTheme(moveQuestionsDto);
  }

  @UseAuthPermissions(PermissionEnum.QUESTION_BANK_EDIT)
  @Put('add-questions')
  async addQuestions(@Body() addQuestionsDto: AddQuestionsToThemeDto) {
    return await this.updateTestThemeService.addToTheme(addQuestionsDto);
  }
}

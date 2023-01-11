import { Body, Controller, Get, Param, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
import { SubmitQuestionService } from '@modules/test/application/submit-question.service';
import { JwtAuthGuard } from '@modules/user/infrastructure/guards/jwt-auth.guard';
import { SubmitManyQuestionDto, SubmitQuestionDto } from '@modules/test/controllers/dtos/submit-question.dto';
import { RequestQuery, RequestWithCredentials } from '@core/libs/types';
import { CreateQuestionDto } from '@modules/test/controllers/dtos/create-question.dto';
import { CreateQuestionService } from '@modules/test/application/create-question.service';
import { FindQuestionService } from '@modules/test/application/find-question.service';
import { ChangeQuestionOrderDto } from '@modules/test/controllers/dtos/change-question-order.dto';
import { UpdateQuestionService } from '@modules/test/application/update-question.service';
import { CreateChildQuestionDto } from '@modules/test/controllers/dtos/create-child-question.dto';
import { UserId } from '@core/libs/user-id.decorator';
import { ChangeComplexityDto } from '@modules/test/controllers/dtos/change-complexity.dto';

@Controller('question')
export class QuestionController {
  constructor(
    private submitQuestionService: SubmitQuestionService,
    private createQuestionService: CreateQuestionService,
    private findQuestionService: FindQuestionService,
    private updateQuestionService: UpdateQuestionService,
  ) {}

  @Get(':id')
  async getById(@Param('id') id: string) {
    return await this.findQuestionService.findById(id);
  }

  @Get('in-theme/:id')
  async getQuestionInThemeById(@Param('id') id: string) {
    return await this.findQuestionService.findQuestionInThemeById(id);
  }

  @Get('excluding/:themeId')
  async getExcludingTheme(@Param('themeId') themeId: string, @Query() requestQuery: RequestQuery) {
    const [questions, total] = await this.findQuestionService.findExcludingTheme(themeId, requestQuery);
    return {
      total,
      data: questions,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() questionDto: CreateQuestionDto, @UserId() userId: string) {
    return await this.createQuestionService.create(questionDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('child')
  async createChild(@Body() questionDto: CreateChildQuestionDto, @UserId() userId: string) {
    return await this.createQuestionService.createChild(questionDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('submit')
  async submit(@Body() submitQuestionDto: SubmitQuestionDto) {
    return this.submitQuestionService.submit(submitQuestionDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('submit-many')
  async submitMany(@Body() submitQuestionDto: SubmitManyQuestionDto) {
    return this.submitQuestionService.submitMany(submitQuestionDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put('order')
  async changeOrder(@Body() questionDto: ChangeQuestionOrderDto, @UserId() userId: string) {
    return await this.updateQuestionService.changeOrder(questionDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('complexity')
  async changeComplexity(@Body() dto: ChangeComplexityDto) {
    return await this.updateQuestionService.changeComplexity(dto);
  }
}

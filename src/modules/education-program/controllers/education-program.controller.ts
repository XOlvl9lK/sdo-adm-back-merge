import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { CreateEducationProgramService } from '@modules/education-program/application/create-education-program.service';
import { CreateEducationProgramDto } from '@modules/education-program/controllers/dtos/create-education-program.dto';
import { FindEducationProgramService } from '@modules/education-program/application/find-education-program.service';
import { DeleteEducationProgramService } from '@modules/education-program/application/delete-education-program.service';
import { IPaginatedResponse, RequestQuery } from '@core/libs/types';
import { UpdateEducationProgramDto } from '@modules/education-program/controllers/dtos/update-education-program.dto';
import { UpdateEducationProgramService } from '@modules/education-program/application/update-education-program.service';
import { EducationProgramEntity } from '@modules/education-program/domain/education-program.entity';
import { JwtAuthGuard } from '@modules/user/infrastructure/guards/jwt-auth.guard';
import { UserId } from '@core/libs/user-id.decorator';
import { Page } from '@core/libs/page.decorator';
import { UnStrictJwtAuthGuard } from '@modules/user/infrastructure/guards/unstrict-jwt-auth.guard';
import { ChangeProgramElementOrder } from 'src/modules/education-program/application/change-program-element-order.service';
import { ChangeOrderDto } from 'src/modules/education-program/controllers/dtos/change-order.dto';

@Controller('education-program')
export class EducationProgramController {
  constructor(
    private createEducationProgramService: CreateEducationProgramService,
    private findEducationProgramService: FindEducationProgramService,
    private deleteEducationProgramService: DeleteEducationProgramService,
    private updateEducationProgramService: UpdateEducationProgramService,
    private changeProgramElementService: ChangeProgramElementOrder,
  ) {}

  @Page('Программы обучения')
  @UseGuards(UnStrictJwtAuthGuard)
  @Get()
  async getAll(@Query() requestQuery: RequestQuery): Promise<IPaginatedResponse<EducationProgramEntity[]>> {
    const [educationPrograms, total] = await this.findEducationProgramService.findAll(requestQuery);
    return {
      total,
      data: educationPrograms,
    };
  }

  @Page('Программы обучения')
  @UseGuards(UnStrictJwtAuthGuard)
  @Get(':id')
  async getById(@Param('id') id: string) {
    return await this.findEducationProgramService.findById(id);
  }

  @Page('Программы обучения')
  @UseGuards(UnStrictJwtAuthGuard)
  @Get('withQuery/:id')
  async getByIdWithQuery(@Param('id') id: string, @Query() requestQuery: RequestQuery, @UserId() userId?: string) {
    return await this.findEducationProgramService.findByIdWithQuery(id, requestQuery, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() educationProgramDto: CreateEducationProgramDto, @UserId() userId: string) {
    return await this.createEducationProgramService.create(educationProgramDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  async update(@Body() educationProgramDto: UpdateEducationProgramDto, @UserId() userId: string) {
    return await this.updateEducationProgramService.update(educationProgramDto, userId);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.deleteEducationProgramService.delete(id);
  }

  //Изменение порядка элементов в списке
  @UseGuards(JwtAuthGuard)
  @Post('sort')
  async changeOrder(@Body() dto: ChangeOrderDto) {
    return await this.changeProgramElementService.changeProgramElementOrder(dto);
  }
}

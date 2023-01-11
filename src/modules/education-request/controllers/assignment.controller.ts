import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CreateAssignmentService } from '@modules/education-request/application/create-assignment.service';
import { EnrollManyDto } from '@modules/education-request/controllers/dtos/create-assignment.dto';
import { FindAssignmentService } from '@modules/education-request/application/find-assignment.service';
import { Page } from '@core/libs/page.decorator';
import { RequestQuery } from '@core/libs/types';
import { PermissionEnum } from '@modules/user/domain/permission.entity';
import { UserId } from '@core/libs/user-id.decorator';
import { UseAuthPermissions } from '@core/libs/use-auth-permissions.decorator';

@Controller('assignment')
export class AssignmentController {
  constructor(
    private createAssignmentService: CreateAssignmentService,
    private findAssignmentService: FindAssignmentService,
  ) {}

  @Page('Зачисления')
  @UseAuthPermissions(PermissionEnum.ASSIGNMENT_ALL)
  @Get()
  async getAll() {
    return await this.findAssignmentService.findAll();
  }

  @Page('Зачисления')
  @UseAuthPermissions(PermissionEnum.ASSIGNMENT_ALL)
  @Get('grouped')
  async getAllGrouped(@Query() requestQuery: RequestQuery) {
    const [data, total] = await this.findAssignmentService.findAllGrouped(requestQuery);
    return { data, total: Number(total?.[0]?.count || 0) };
  }

  @Page('Зачисления')
  @UseAuthPermissions(PermissionEnum.ASSIGNMENT_ALL)
  @Get('by-group-or-user/:id')
  async getByGroupIdOrUserId(@Param('id') id: string, @Query() requestQuery: RequestQuery) {
    const [data, total] = await this.findAssignmentService.findByGroupIdOrUserId(id, requestQuery);
    return { data, total };
  }

  @Page('Зачисления')
  @UseAuthPermissions(PermissionEnum.ASSIGNMENT_ALL)
  @Get(':id')
  async getById(@Param('id') id: string) {
    return await this.findAssignmentService.findById(id);
  }

  @UseAuthPermissions(PermissionEnum.ASSIGNMENT_CREATE)
  @Post('enroll')
  async enroll(@Body() assignmentDto: EnrollManyDto, @UserId() userId: string) {
    return await this.createAssignmentService.createMany(assignmentDto, userId);
  }
}

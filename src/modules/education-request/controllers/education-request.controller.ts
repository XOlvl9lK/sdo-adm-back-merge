import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { CreateEducationRequestService } from '@modules/education-request/application/create-education-request.service';
import { UpdateEducationRequestService } from '@modules/education-request/application/update-education-request.service';
import {
  CreateUserEducationRequestRequestDto
} from '@modules/education-request/controllers/dtos/create-education-request.dto';
import { FindEducationRequestService } from '@modules/education-request/application/find-education-request.service';
import {
  UpdateEducationRequestByIdsDto,
  UpdateEducationRequestDto,
} from '@modules/education-request/controllers/dtos/update-education-request.dto';
import { JwtAuthGuard } from '@modules/user/infrastructure/guards/jwt-auth.guard';
import { UserId } from '@core/libs/user-id.decorator';
import { Page } from '@core/libs/page.decorator';
import { RequestQuery } from '@core/libs/types';
import { PermissionEnum } from '@modules/user/domain/permission.entity';
import { DeleteEducationRequestService } from '@modules/education-request/application/delete-education-request.service';
import { UseAuthPermissions } from '@core/libs/use-auth-permissions.decorator';

@Controller('education-request')
export class EducationRequestController {
  constructor(
    private createEducationRequestService: CreateEducationRequestService,
    private updateEducationRequestService: UpdateEducationRequestService,
    private findEducationRequestService: FindEducationRequestService,
    private deleteEducationRequestService: DeleteEducationRequestService,
  ) {}

  @Get()
  async getAll(@Query('search') search?: string) {
    return await this.findEducationRequestService.findAll(search);
  }

  @Page('Заявки пользователей')
  @UseAuthPermissions(PermissionEnum.ASSIGNMENT_USERS)
  @Get('users-requests')
  async findAllUsersRequests(@Query() requestQuery: RequestQuery) {
    const [data, total] = await this.findEducationRequestService.findAllUsersRequests(requestQuery);
    return { data, total: Number(total?.[0]?.count || 0) };
  }

  @Page('Заявки пользователей')
  @UseAuthPermissions(PermissionEnum.ASSIGNMENT_USERS)
  @Get('users-requests/:userId')
  async findUsersRequestsByUser(@Param('userId') userId: string, @Query() requestQuery: RequestQuery) {
    const [data, total] = await this.findEducationRequestService.findUsersRequestsByUser(userId, requestQuery);
    return { data, total };
  }

  @Page('Заявки пользователей')
  @UseAuthPermissions(PermissionEnum.ASSIGNMENT_USERS)
  @Get('not-processed/:userId')
  async getNotProcessedByUser(@Param('userId') userId: string, @Query() requestQuery: RequestQuery) {
    const [data, total] = await this.findEducationRequestService.findNotProcessedByUserId(userId, requestQuery)
    return { data, total }
  }

  @Page('Мои заявки')
  @UseAuthPermissions(PermissionEnum.EDUCATION_REQUESTS)
  @Get('user')
  async getByCurrentUser(@UserId() userId: string, @Query() requestQuery: RequestQuery) {
    const [data, total] = await this.findEducationRequestService.findAllByUserId(userId, requestQuery);
    return { data, total };
  }

  @Get('user/:userId')
  async getAcceptedByUserId(@Param('userId') userId: string, @Query() requestQuery: RequestQuery) {
    const [data, total] = await this.findEducationRequestService.findAcceptedByUserId(userId, requestQuery);
    return { data, total };
  }

  @UseAuthPermissions(PermissionEnum.EDUCATION_REQUESTS)
  @Get(':id')
  async getById(@Param('id') id: string, @UserId() userId: string) {
    return await this.findEducationRequestService.findById(id, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() educationRequestDto: CreateUserEducationRequestRequestDto, @UserId() userId: string) {
    return await this.createEducationRequestService.createForUser(educationRequestDto, userId);
  }

  @UseAuthPermissions(PermissionEnum.EDUCATION_REQUESTS_ACCEPT)
  @Put('accept')
  async accept(@Body() educationRequestDto: UpdateEducationRequestDto, @UserId() userId: string) {
    return await this.updateEducationRequestService.accept(educationRequestDto, userId);
  }

  @UseAuthPermissions(PermissionEnum.EDUCATION_REQUESTS_ACCEPT)
  @Put('accept-by-id')
  async acceptByIds(@Body() educationRequestDto: UpdateEducationRequestByIdsDto, @UserId() userId: string) {
    return await this.updateEducationRequestService.acceptByIds(educationRequestDto, userId);
  }

  @UseAuthPermissions(PermissionEnum.EDUCATION_REQUESTS_REJECT)
  @Put('reject')
  async reject(@Body() educationRequestDto: UpdateEducationRequestDto, @UserId() userId: string) {
    return await this.updateEducationRequestService.reject(educationRequestDto, userId);
  }

  @UseAuthPermissions(PermissionEnum.EDUCATION_REQUESTS_REJECT)
  @Put('reject-by-id')
  async rejectByIds(@Body() educationRequestDto: UpdateEducationRequestByIdsDto, @UserId() userId: string) {
    return await this.updateEducationRequestService.rejectByIds(educationRequestDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.deleteEducationRequestService.delete(id);
  }
}

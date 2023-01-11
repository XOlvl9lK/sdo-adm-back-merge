import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserService } from '@modules/user/application/create-user.service';
import { CreateUserDto } from '@modules/user/controllers/dtos/create-user.dto';
import { FindUserService } from '@modules/user/application/find-user.service';
import { JwtAuthGuard } from '@modules/user/infrastructure/guards/jwt-auth.guard';
import { RequestQuery } from '@core/libs/types';
import { UpdateUserDto } from '@modules/user/controllers/dtos/update-user.dto';
import { UpdateUserService } from '@modules/user/application/update-user.service';
import { UserId } from '@core/libs/user-id.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { ImportDibUserService } from '@src/modules/user/application/import-dib-user.service';
import { ImportDibUserDto } from '@src/modules/user/controllers/dtos/import-dib-user.dto';
import { UpdateProfileDto } from '@modules/user/controllers/dtos/update-profile.dto';
import { Page } from '@core/libs/page.decorator';
import { PermissionEnum } from '@modules/user/domain/permission.entity';
import { ImportUserService } from 'src/modules/user/application/import-user.service';
import { ImportUserDto } from 'src/modules/user/controllers/dtos/import-user.dto';
import { UseAuthPermissions } from '@core/libs/use-auth-permissions.decorator';

@Controller('user')
export class UserController {
  constructor(
    private createUserService: CreateUserService,
    private findUserService: FindUserService,
    private updateUserService: UpdateUserService,
    private importDibUserService: ImportDibUserService,
    private importUserService: ImportUserService,
  ) {}

  @Page('Пользователи')
  @UseAuthPermissions(PermissionEnum.USERS)
  @Get()
  async getAll(@Query() requestQuery: RequestQuery) {
    const [data, total] = await this.findUserService.findAll(requestQuery);
    return { data, total };
  }

  @UseGuards(JwtAuthGuard)
  @Get('minimal')
  async getAllMinimal(@Query() requestQuery: RequestQuery) {
    const [data, total] = await this.findUserService.findAllMinimal(requestQuery);
    return { data, total };
  }

  @UseGuards(JwtAuthGuard)
  @Get('current')
  async getCurrent(@UserId() userId: string) {
    return await this.findUserService.findById(userId);
  }

  @UseAuthPermissions(PermissionEnum.USERS)
  @Get('create-options')
  async getCreateOptions() {
    return await this.findUserService.findCreateOptions();
  }

  @UseAuthPermissions(PermissionEnum.USERS)
  @Get('import-options')
  async getImportOptions() {
    return await this.findUserService.findImportOption();
  }

  @UseAuthPermissions(PermissionEnum.USERS)
  @Get(':id')
  async getById(@Param('id') id: string) {
    return await this.findUserService.findById(id);
  }

  @UseAuthPermissions(PermissionEnum.GROUP_EDIT)
  @Get('to-add/:groupId')
  async getUsersToAddInGroup(@Param('groupId') groupId: string, @Query('search') search: string) {
    return await this.findUserService.findToAddInGroup(groupId, search);
  }

  @UseAuthPermissions(PermissionEnum.USERS_CREATE)
  @Post('validate-for-dib-import')
  @UseInterceptors(FileInterceptor('file'))
  async validateUsersForDibImport(@UploadedFile() file: Express.Multer.File, @UserId() userId: string) {
    return this.importDibUserService.validateUsersForImport(file, userId);
  }

  @UseAuthPermissions(PermissionEnum.USERS_CREATE)
  @Post('dib-import')
  @UseInterceptors(FileInterceptor('file'))
  async importDibUsers(
    @UploadedFile() file: Express.Multer.File,
    @Body() importDibUsersDto: { dto: string },
    @UserId() userId: string,
  ) {
    return this.importDibUserService.importUsers(file, JSON.parse(importDibUsersDto.dto) as ImportDibUserDto, userId);
  }

  @UseAuthPermissions(PermissionEnum.USERS_CREATE)
  @Post('validate-for-import')
  @UseInterceptors(FileInterceptor('file'))
  async validateUsersForImport(@UploadedFile() file: Express.Multer.File, @UserId() userId: string) {
    return await this.importUserService.validateUsers(file.buffer, userId);
  }

  @UseAuthPermissions(PermissionEnum.USERS_CREATE)
  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  async importUsers(
    @UploadedFile() file: Express.Multer.File,
    @Body() importUsersDto: { dto: string },
    @UserId() userId: string,
  ) {
    return this.importUserService.importUsers(file.buffer, JSON.parse(importUsersDto.dto) as ImportUserDto, userId);
  }

  @UseAuthPermissions(PermissionEnum.USERS_CREATE)
  @Post()
  async create(@Body() userDto: CreateUserDto, @UserId() userId: string) {
    return await this.createUserService.create(userDto, userId);
  }

  @UseAuthPermissions(PermissionEnum.USERS_EDIT)
  @Put()
  async update(@Body() userDto: UpdateUserDto, @UserId() userId: string) {
    return await this.updateUserService.update(userDto, userId);
  }

  @UseAuthPermissions(PermissionEnum.PROFILE_EDIT)
  @Put('profile')
  async updateProfile(@Body() userDto: UpdateProfileDto) {
    return await this.updateUserService.updateProfile(userDto);
  }
}

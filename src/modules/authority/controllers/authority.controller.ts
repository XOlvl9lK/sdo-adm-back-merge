import { Body, Controller, Get, Param, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { CreateAuthorityService } from '@modules/authority/application/create-authority.service';
import { CreateAuthorityRequestDto } from '@modules/authority/controllers/dtos/create-authority.request-dto';
import { FindAuthorityService } from '@modules/authority/application/find-authority.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { AuthorityEnum } from '@modules/authority/domain/authority.enum';
import { ImportAuthorityService } from '@modules/authority/application/import-authority.service';
import { RequestQuery } from '@core/libs/types';
import { JwtAuthGuard } from '@modules/user/infrastructure/guards/jwt-auth.guard';

@Controller('authority')
export class AuthorityController {
  constructor(
    private createAuthorityService: CreateAuthorityService,
    private findAuthorityService: FindAuthorityService,
    private importAuthorityService: ImportAuthorityService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('role-dib/program-setting-available')
  async getAvailableRolesForProgramSettings(@Query('search') search?: string) {
    return await this.findAuthorityService.getAvailableRolesForProgramSettings(search);
  }

  @UseGuards(JwtAuthGuard)
  @Get('role-dib')
  async getRoleDib(@Query() requestQuery?: RequestQuery) {
    return await this.findAuthorityService.findRoleDib(requestQuery);
  }

  @UseGuards(JwtAuthGuard)
  @Get('department')
  async getDepartment(@Query() requestQuery?: RequestQuery) {
    return await this.findAuthorityService.findDepartment(requestQuery);
  }

  @UseGuards(JwtAuthGuard)
  @Get('region')
  async getRegion(@Query() requestQuery?: RequestQuery) {
    return await this.findAuthorityService.findRegion(requestQuery);
  }

  @UseGuards(JwtAuthGuard)
  @Get('region/:id')
  async getRegionById(@Param('id') id: string) {
    return await this.findAuthorityService.findRegionById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('subdivision')
  async getSubdivision(@Query() requestQuery?: RequestQuery) {
    return await this.findAuthorityService.findSubdivision(requestQuery);
  }

  @UseGuards(JwtAuthGuard)
  @Get('subdivision/:id')
  async getSubdivisionById(@Param('id') id: string) {
    return await this.findAuthorityService.findSubdivisionById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('import/:authority')
  @UseInterceptors(FileInterceptor('file'))
  async import(@Param('authority') authority: AuthorityEnum, @UploadedFile() file: Express.Multer.File) {
    return await this.importAuthorityService.import(authority, file);
  }
}

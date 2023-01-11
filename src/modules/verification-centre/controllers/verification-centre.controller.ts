import { Body, Controller, Delete, Get, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { CreateVerificationDocumentService } from '@modules/verification-centre/application/create-verification-document.service';
import { CreateVerificationDocumentRequestDto } from '@modules/verification-centre/controllers/dtos/create-verification-document.request-dto';
import { VerificationDocumentTypeEnum } from '@modules/verification-centre/domain/verification-document.entity';
import { FindVerificationDocumentService } from '@modules/verification-centre/application/find-verification-document.service';
import { DeleteVerificationDocumentRequestDto } from '@modules/verification-centre/controllers/dtos/delete-verification-document.request-dto';
import { DeleteVerificationDocumentService } from '@modules/verification-centre/application/delete-verification-document.service';
import { UserId } from '@core/libs/user-id.decorator';
import { Page } from '@core/libs/page.decorator';
import { UnStrictJwtAuthGuard } from '@modules/user/infrastructure/guards/unstrict-jwt-auth.guard';
import { PermissionEnum } from '@modules/user/domain/permission.entity';
import { RequestQuery } from '@core/libs/types';
import { UseAuthPermissions } from '@core/libs/use-auth-permissions.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('verification-centre')
export class VerificationCentreController {
  constructor(
    private createVerificationDocumentService: CreateVerificationDocumentService,
    private findVerificationDocumentService: FindVerificationDocumentService,
    private deleteVerificationDocumentService: DeleteVerificationDocumentService,
  ) {}

  @Page('Удостоверяющий центр')
  @UseGuards(UnStrictJwtAuthGuard)
  @Get()
  async getAll(@Query() requestQuery: RequestQuery) {
    const [data, total] = await this.findVerificationDocumentService.findAll(requestQuery);
    return { data, total };
  }

  @Page('Удостоверяющий центр')
  @UseGuards(UnStrictJwtAuthGuard)
  @Get('normative')
  async getNormative(@Query() requestQuery: RequestQuery) {
    return await this.findVerificationDocumentService.findByDocumentType(
      VerificationDocumentTypeEnum.NORMATIVE,
      requestQuery,
    );
  }

  @Page('Удостоверяющий центр')
  @UseGuards(UnStrictJwtAuthGuard)
  @Get('license')
  async getLicense(@Query() requestQuery: RequestQuery) {
    return await this.findVerificationDocumentService.findByDocumentType(
      VerificationDocumentTypeEnum.LICENSE,
      requestQuery,
    );
  }

  @Page('Удостоверяющий центр')
  @UseGuards(UnStrictJwtAuthGuard)
  @Get('revoked')
  async getRevoked(@Query() requestQuery: RequestQuery) {
    return await this.findVerificationDocumentService.findByDocumentType(
      VerificationDocumentTypeEnum.REVOKED,
      requestQuery,
    );
  }

  @Page('Удостоверяющий центр')
  @UseGuards(UnStrictJwtAuthGuard)
  @Get('root')
  async getRoot(@Query() requestQuery: RequestQuery) {
    return await this.findVerificationDocumentService.findByDocumentType(
      VerificationDocumentTypeEnum.ROOT,
      requestQuery,
    );
  }

  @UseInterceptors(FileInterceptor('file'))
  @UseAuthPermissions(PermissionEnum.VERIFICATION_CENTRE_EDIT)
  @Post('normative')
  async createNormative(@UploadedFile() file: Express.Multer.File, @UserId() userId: string) {
    return await this.createVerificationDocumentService.create(
      file,
      VerificationDocumentTypeEnum.NORMATIVE,
      userId,
    );
  }

  @UseInterceptors(FileInterceptor('file'))
  @UseAuthPermissions(PermissionEnum.VERIFICATION_CENTRE_EDIT)
  @Post('license')
  async createLicense(@UploadedFile() file: Express.Multer.File, @UserId() userId: string) {
    return await this.createVerificationDocumentService.create(
      file,
      VerificationDocumentTypeEnum.LICENSE,
      userId,
    );
  }

  @UseInterceptors(FileInterceptor('file'))
  @UseAuthPermissions(PermissionEnum.VERIFICATION_CENTRE_EDIT)
  @Post('revoked')
  async createRevoked(@UploadedFile() file: Express.Multer.File, @UserId() userId: string) {
    return await this.createVerificationDocumentService.create(
      file,
      VerificationDocumentTypeEnum.REVOKED,
      userId,
    );
  }

  @UseInterceptors(FileInterceptor('file'))
  @UseAuthPermissions(PermissionEnum.VERIFICATION_CENTRE_EDIT)
  @Post('root')
  async createRoot(@UploadedFile() file: Express.Multer.File, @UserId() userId: string) {
    return await this.createVerificationDocumentService.create(file, VerificationDocumentTypeEnum.ROOT, userId);
  }

  @UseAuthPermissions(PermissionEnum.VERIFICATION_CENTRE_EDIT)
  @Delete()
  async deleteDocument(@Body() documentDto: DeleteVerificationDocumentRequestDto) {
    return await this.deleteVerificationDocumentService.deleteMany(documentDto);
  }
}

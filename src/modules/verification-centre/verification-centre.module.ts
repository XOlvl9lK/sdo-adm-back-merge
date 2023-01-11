import { Module } from '@nestjs/common';
import { VerificationCentreController } from '@modules/verification-centre/controllers/verification-centre.controller';
import { CreateVerificationDocumentService } from '@modules/verification-centre/application/create-verification-document.service';
import { FindVerificationDocumentService } from '@modules/verification-centre/application/find-verification-document.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileRepository } from '@src/modules/file/infrastructure/database/file.repository';
import { VerificationDocumentRepository } from '@modules/verification-centre/infrastructure/database/verification-document.repository';
import { DeleteVerificationDocumentService } from '@modules/verification-centre/application/delete-verification-document.service';
import { FileModule } from 'src/modules/file/file.module';

@Module({
  controllers: [VerificationCentreController],
  imports: [
    TypeOrmModule.forFeature([FileRepository, VerificationDocumentRepository]),
    FileModule
  ],
  providers: [CreateVerificationDocumentService, FindVerificationDocumentService, DeleteVerificationDocumentService],
})
export class VerificationCentreModule {}

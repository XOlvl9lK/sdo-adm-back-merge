import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VerificationDocumentRepository } from '@modules/verification-centre/infrastructure/database/verification-document.repository';
import { DeleteVerificationDocumentRequestDto } from '@modules/verification-centre/controllers/dtos/delete-verification-document.request-dto';
import { DeleteFileService } from '@src/modules/file/application/delete-file.service';

@Injectable()
export class DeleteVerificationDocumentService {
  constructor(
    @InjectRepository(VerificationDocumentRepository)
    private verificationDocumentRepository: VerificationDocumentRepository,
    private deleteFileService: DeleteFileService,
  ) {}

  async deleteMany({ verificationDocumentId }: DeleteVerificationDocumentRequestDto) {
    const document = await this.verificationDocumentRepository.findById(verificationDocumentId);
    await this.verificationDocumentRepository.remove(document);
    await this.deleteFileService.delete(document.file.id);
    return { success: true };
  }
}

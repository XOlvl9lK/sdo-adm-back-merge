import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VerificationDocumentRepository } from '@modules/verification-centre/infrastructure/database/verification-document.repository';
import { VerificationDocumentTypeEnum } from '@modules/verification-centre/domain/verification-document.entity';
import { RequestQuery } from '@core/libs/types';

@Injectable()
export class FindVerificationDocumentService {
  constructor(
    @InjectRepository(VerificationDocumentRepository)
    private verificationDocumentRepository: VerificationDocumentRepository,
  ) {}

  async findAll(requestQuery: RequestQuery) {
    return await this.verificationDocumentRepository.findAll(requestQuery);
  }

  async findByDocumentType(documentType: VerificationDocumentTypeEnum, requestQuery: RequestQuery) {
    const [data, total] = await this.verificationDocumentRepository.findByDocumentType(documentType, requestQuery);
    return { data, total };
  }
}

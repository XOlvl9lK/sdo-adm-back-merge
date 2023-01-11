import { EntityRepository, ILike } from 'typeorm';
import {
  VerificationDocumentEntity,
  VerificationDocumentTypeEnum,
} from '@modules/verification-centre/domain/verification-document.entity';
import { BaseRepository } from '@core/database/base.repository';
import { RequestQuery } from '@core/libs/types';

@EntityRepository(VerificationDocumentEntity)
export class VerificationDocumentRepository extends BaseRepository<VerificationDocumentEntity> {
  findById(id: string) {
    return this.findOne({ relations: ['file'], where: { id } });
  }

  findAll({ search, pageSize, page, sort }: RequestQuery) {
    return this.findAndCount({
      relations: ['file'],
      where: {
        ...this.processSearchQuery(search),
      },
      ...this.processPaginationQuery(page, pageSize),
      ...this.processSortQuery(sort),
    });
  }

  findByDocumentType(documentType: VerificationDocumentTypeEnum, { search, sort, page, pageSize }: RequestQuery) {
    return this.findAndCount({
      relations: ['file'],
      where: {
        documentType,
        ...this.processSearchQuery(search),
      },
      ...this.processPaginationQuery(page, pageSize),
      ...this.processSortQuery(sort),
    });
  }
}

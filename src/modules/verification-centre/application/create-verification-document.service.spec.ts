import { mockBaseEntity } from '@core/domain/base.entity.mock';
import { Random } from '@core/test/random';
import {
  VerificationDocumentEntity,
  VerificationDocumentTypeEnum,
} from '@modules/verification-centre/domain/verification-document.entity';
import { mockFileInstance } from '@modules/file/domain/file.entity.mock';
import { plainToInstance } from 'class-transformer';
import { CreateVerificationDocumentService } from '@modules/verification-centre/application/create-verification-document.service';
import { fileRepositoryMockProvider, TestHelper } from '@core/test/test.helper';
import { VerificationDocumentRepository } from '@modules/verification-centre/infrastructure/database/verification-document.repository';
import { Test } from '@nestjs/testing';

const mockVerificationDocument = {
  ...mockBaseEntity,
  title: Random.lorem,
  file: mockFileInstance,
  documentType: VerificationDocumentTypeEnum.NORMATIVE,
};

export const mockVerificationDocumentInstance = plainToInstance(VerificationDocumentEntity, mockVerificationDocument);

const helpers = new TestHelper(
  {
    type: 'repository',
    provide: VerificationDocumentRepository,
    mockValue: mockVerificationDocumentInstance,
  },
  fileRepositoryMockProvider,
);

describe('CreateVerificationDocumentService', () => {
  let createVerificationDocumentService: CreateVerificationDocumentService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [CreateVerificationDocumentService, ...helpers.mockProviders, helpers.eventEmitterMockProvider],
    }).compile();

    createVerificationDocumentService = moduleRef.get(CreateVerificationDocumentService);
  });

  test('Should save verificationDocument in database and emit', async () => {
    // await createVerificationDocumentService.create(
    //   { fileId: Random.id },
    //   VerificationDocumentTypeEnum.NORMATIVE,
    //   Random.id,
    // );

    const mockVerificationDocumentRepository = helpers.getProviderByToken('VerificationDocumentRepository').useValue;

    expect(mockVerificationDocumentRepository.save).toHaveBeenCalledTimes(1);
    expect(helpers.eventEmitterMockProvider.useValue.emit).toHaveBeenCalledTimes(1);
  });
});

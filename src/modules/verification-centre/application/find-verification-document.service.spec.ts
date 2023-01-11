import { TestHelper } from '@core/test/test.helper';
import { VerificationDocumentRepository } from '@modules/verification-centre/infrastructure/database/verification-document.repository';
import { mockVerificationDocumentInstance } from '@modules/verification-centre/application/create-verification-document.service.spec';
import { FindVerificationDocumentService } from '@modules/verification-centre/application/find-verification-document.service';
import { Test } from '@nestjs/testing';
import { VerificationDocumentTypeEnum } from '@modules/verification-centre/domain/verification-document.entity';

const helpers = new TestHelper({
  type: 'repository',
  provide: VerificationDocumentRepository,
  mockValue: mockVerificationDocumentInstance,
  extend: [
    {
      method: 'findByDocumentType',
      mockImplementation: jest.fn().mockResolvedValue([mockVerificationDocumentInstance]),
    },
    {
      method: 'findAll',
      mockImplementation: jest.fn().mockResolvedValue([mockVerificationDocumentInstance]),
    },
  ],
});

describe('FindVerificationDocumentService', () => {
  let findVerificationDocumentService: FindVerificationDocumentService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [FindVerificationDocumentService, ...helpers.mockProviders],
    }).compile();

    findVerificationDocumentService = moduleRef.get(FindVerificationDocumentService);
  });

  test('Should return all verificationDocuments', async () => {
    const result = await findVerificationDocumentService.findAll();

    expect(result).toEqual([mockVerificationDocumentInstance]);
  });

  test('Should return verificationDocuments by document type', async () => {
    const result = await findVerificationDocumentService.findByDocumentType(VerificationDocumentTypeEnum.NORMATIVE);

    const mockVerificationDocumentRepository = helpers.getProviderByToken('VerificationDocumentRepository').useValue;

    expect(mockVerificationDocumentRepository.findByDocumentType).toHaveBeenCalledWith(
      VerificationDocumentTypeEnum.NORMATIVE,
    );
    expect(result).toEqual([mockVerificationDocumentInstance]);
  });
});

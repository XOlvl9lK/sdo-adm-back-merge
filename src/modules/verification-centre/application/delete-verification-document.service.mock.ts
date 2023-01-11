import { TestHelper } from '@core/test/test.helper';
import { VerificationDocumentRepository } from '@modules/verification-centre/infrastructure/database/verification-document.repository';
import { mockVerificationDocumentInstance } from '@modules/verification-centre/application/create-verification-document.service.spec';
import { DeleteVerificationDocumentService } from '@modules/verification-centre/application/delete-verification-document.service';
import { Test } from '@nestjs/testing';
import { DeleteFileService } from '@modules/file/application/delete-file.service';
import { Random } from '@core/test/random';
import clearAllMocks = jest.clearAllMocks;

const helpers = new TestHelper({
  type: 'repository',
  provide: VerificationDocumentRepository,
  mockValue: mockVerificationDocumentInstance,
});

const mockDeleteFileServiceProvider = {
  provide: DeleteFileService,
  useValue: {
    delete: jest.fn(),
  },
};

// describe('DeleteVerificationDocumentService', () => {
//   let deleteVerificationDocumentService: DeleteVerificationDocumentService
//
//   beforeAll(async () => {
//     const moduleRef = await Test.createTestingModule({
//       providers: [
//         DeleteVerificationDocumentService,
//         ...helpers.mockProviders,
//         mockDeleteFileServiceProvider
//       ]
//     }).compile()
//
//     deleteVerificationDocumentService = moduleRef.get(DeleteVerificationDocumentService)
//   })
//
//   test('Should delete verificationDocument from database and delete file', async () => {
//     await deleteVerificationDocumentService.deleteMany({ verificationDocumentId: Random.id })
//
//     const mockVerificationDocumentRepository = helpers.getProviderByToken('VerificationDocumentRepository').useValue
//
//     expect(mockVerificationDocumentRepository.remove).toHaveBeenCalledTimes(1)
//     expect(mockDeleteFileServiceProvider.useValue.delete).toHaveBeenCalledTimes(1)
//   })
//
//   afterEach(() => {
//     clearAllMocks()
//   })
// })

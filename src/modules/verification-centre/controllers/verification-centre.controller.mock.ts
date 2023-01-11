import { VerificationCentreController } from '@modules/verification-centre/controllers/verification-centre.controller';
import { Test } from '@nestjs/testing';
import { CreateVerificationDocumentService } from '@modules/verification-centre/application/create-verification-document.service';
import { FindVerificationDocumentService } from '@modules/verification-centre/application/find-verification-document.service';
import { mockVerificationDocumentInstance } from '@modules/verification-centre/application/create-verification-document.service.spec';
import { DeleteVerificationDocumentService } from '@modules/verification-centre/application/delete-verification-document.service';
import { VerificationDocumentTypeEnum } from '@modules/verification-centre/domain/verification-document.entity';
import { Random } from '@core/test/random';

const mockCreateVerificationDocumentService = {
  provide: CreateVerificationDocumentService,
  useValue: {
    create: jest.fn(),
  },
};

const mockDeleteVerificationDocumentService = {
  provide: DeleteVerificationDocumentService,
  useValue: {
    deleteMany: jest.fn(),
  },
};

const mockFindVerificationDocumentService = {
  provide: FindVerificationDocumentService,
  useValue: {
    findAll: jest.fn().mockResolvedValue([mockVerificationDocumentInstance]),
    findByDocumentType: jest.fn().mockResolvedValue([mockVerificationDocumentInstance]),
  },
};

// describe('VerificationCentreController', () => {
//   let verificationCentreController: VerificationCentreController
//
//   beforeAll(async () => {
//     const moduleRef = await Test.createTestingModule({
//       controllers: [VerificationCentreController],
//       providers: [
//         mockCreateVerificationDocumentService,
//         mockFindVerificationDocumentService,
//         mockDeleteVerificationDocumentService
//       ]
//     }).compile()
//
//     verificationCentreController = moduleRef.get(VerificationCentreController)
//   })
//
//   test('Should return all verificationDocuments', async () => {
//     const result = await verificationCentreController.getAll()
//
//     expect(result).toEqual([mockVerificationDocumentInstance])
//   })
//
//   test('Should return normative verificationDocuments', async () => {
//     const result = await verificationCentreController.getNormative()
//
//     expect(mockFindVerificationDocumentService.useValue.findByDocumentType).toHaveBeenCalledWith(VerificationDocumentTypeEnum.NORMATIVE)
//     expect(result).toEqual([mockVerificationDocumentInstance])
//   })
//
//   test('Should return license verificationDocuments', async () => {
//     const result = await verificationCentreController.getLicense()
//
//     expect(mockFindVerificationDocumentService.useValue.findByDocumentType).toHaveBeenCalledWith(VerificationDocumentTypeEnum.LICENSE)
//     expect(result).toEqual([mockVerificationDocumentInstance])
//   })
//
//   test('Should return revoked verificationDocuments', async () => {
//     const result = await verificationCentreController.getRevoked()
//
//     expect(mockFindVerificationDocumentService.useValue.findByDocumentType).toHaveBeenCalledWith(VerificationDocumentTypeEnum.REVOKED)
//     expect(result).toEqual([mockVerificationDocumentInstance])
//   })
//
//   test('Should return root verificationDocuments', async () => {
//     const result = await verificationCentreController.getRoot()
//
//     expect(mockFindVerificationDocumentService.useValue.findByDocumentType).toHaveBeenCalledWith(VerificationDocumentTypeEnum.ROOT)
//     expect(result).toEqual([mockVerificationDocumentInstance])
//   })
//
//   test('Should create normative verificationDocument', async () => {
//     await verificationCentreController.createNormative({ fileId: Random.id }, Random.id)
//
//     expect(mockCreateVerificationDocumentService.useValue.create).toHaveBeenCalled()
//   })
//
//   test('Should create license verificationDocument', async () => {
//     await verificationCentreController.createLicense({ fileId: Random.id }, Random.id)
//
//     expect(mockCreateVerificationDocumentService.useValue.create).toHaveBeenCalled()
//   })
//
//   test('Should create revoked verificationDocument', async () => {
//     await verificationCentreController.createRevoked({ fileId: Random.id }, Random.id)
//
//     expect(mockCreateVerificationDocumentService.useValue.create).toHaveBeenCalled()
//   })
//
//   test('Should create root verificationDocument', async () => {
//     await verificationCentreController.createRoot({ fileId: Random.id }, Random.id)
//
//     expect(mockCreateVerificationDocumentService.useValue.create).toHaveBeenCalled()
//   })
//
//   test('Should delete verificationDocument', async () => {
//     await verificationCentreController.deleteDocument({ verificationDocumentId: Random.id })
//
//     expect(mockDeleteVerificationDocumentService.useValue.deleteMany).toHaveBeenCalled()
//   })
// })

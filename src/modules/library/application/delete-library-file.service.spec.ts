import { libraryFileRepositoryMockProvider, TestHelper } from '@core/test/test.helper';
import { DeleteLibraryFileService } from '@modules/library/application/delete-library-file.service';
import { DeleteFileService } from '@modules/file/application/delete-file.service';
import { Random } from '@core/test/random';
import { mockLibraryFileInstance } from '@modules/library/domain/library-file.entity.spec';

const helpers = new TestHelper(libraryFileRepositoryMockProvider);

describe('DeleteLibraryFileService', () => {
  // let deleteLibraryFileService: DeleteLibraryFileService
  //
  // beforeAll(async () => {
  //   [deleteLibraryFileService] = await helpers.beforeAll(
  //     [DeleteLibraryFileService],
  //     [
  //       {
  //         provide: DeleteFileService,
  //         useValue: {
  //           delete: jest.fn()
  //         }
  //       }
  //     ]
  //   )
  // })
  //
  // test('Should delete library file', async () => {
  //   await deleteLibraryFileService.deleteMany({ libraryFileIds: [Random.id] })
  //
  //   const mockLibraryFileRepository = helpers.getProviderValueByToken('LibraryFileRepository')
  //   const mockDeleteFileService = helpers.getProviderValueByToken('DeleteFileService')
  //
  //   expect(mockLibraryFileRepository.remove).toHaveBeenCalledWith(mockLibraryFileInstance)
  //   expect(mockDeleteFileService.delete).toHaveBeenCalledWith(Random.id)
  // })
});

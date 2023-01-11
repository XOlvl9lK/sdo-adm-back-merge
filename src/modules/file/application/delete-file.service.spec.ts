import { fileRepositoryMockProvider, TestHelper } from '@core/test/test.helper';
import { DeleteFileService } from '@modules/file/application/delete-file.service';
import { FileService } from '@modules/file/infrastructure/file.service';
import { Random } from '@core/test/random';
import { mockFileInstance } from '@modules/file/domain/file.entity.mock';

const helpers = new TestHelper(fileRepositoryMockProvider);

describe('DeleteFileService', () => {
  // let deleteFileService: DeleteFileService
  //
  // beforeAll(async () => {
  //   [deleteFileService] = await helpers.beforeAll(
  //     [DeleteFileService],
  //     []
  //   )
  // })
  //
  // test('Should delete file', async () => {
  //   await deleteFileService.delete(Random.id)
  //
  //   const mockFileRepository = helpers.getProviderValueByToken('FileRepository')
  //   const mockFileService = helpers.getProviderValueByToken('FileService')
  //
  //   expect(mockFileRepository.remove).toHaveBeenCalledTimes(1)
  //   expect(mockFileRepository.remove).toHaveBeenCalledWith(mockFileInstance)
  //   expect(mockFileService.delete).toHaveBeenCalledTimes(1)
  //   expect(mockFileService.delete).toHaveBeenCalledWith(Random.id)
  // })
});

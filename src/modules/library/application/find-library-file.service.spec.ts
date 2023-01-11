import { libraryFileRepositoryMockProvider, TestHelper } from '@core/test/test.helper';
import { FindLibraryFileService } from '@modules/library/application/find-library-file.service';
import { mockInstallerInstance, mockLibraryFileInstance } from '@modules/library/domain/library-file.entity.spec';
import { Random } from '@core/test/random';

const helpers = new TestHelper(libraryFileRepositoryMockProvider);

describe('FindLibraryFileService', () => {
  let findLibraryFileService: FindLibraryFileService;

  beforeAll(async () => {
    [findLibraryFileService] = await helpers.beforeAll([FindLibraryFileService]);
  });

  test('Should return all library files and count', async () => {
    const result = await findLibraryFileService.findAll({});

    expect(result).toEqual([[mockLibraryFileInstance], Random.number]);
  });

  test('Should return library file by id', async () => {
    const result = await findLibraryFileService.findById(Random.id);

    expect(result).toEqual(mockLibraryFileInstance);
  });

  test('Should return installers win', async () => {
    const result = await findLibraryFileService.findInstallersWin();

    expect(result).toEqual({
      installerWin86: mockInstallerInstance,
      installerWin64: mockInstallerInstance,
    });
  });

  test('Should return installer lin', async () => {
    const result = await findLibraryFileService.findInstallerLin();

    expect(result).toEqual(mockInstallerInstance);
  });

  test('Should return installer meta', async () => {
    const result = await findLibraryFileService.findInstallersMeta();

    expect(result).toEqual({
      installerMetaWin: mockInstallerInstance,
      installerMetaLin: mockInstallerInstance,
    });
  });
});

import { mockBaseEntity } from '@core/domain/base.entity.mock';
import { Random } from '@core/test/random';
import { mockUserInstance } from '@modules/user/domain/user.entity.spec';
import { mockFileInstance } from '@modules/file/domain/file.entity.mock';
import { mockChapterInstance } from '@modules/chapter/domain/chapter.entity.spec';
import { plainToInstance } from 'class-transformer';
import { InstallersEnum, LibraryFileEntity } from '@modules/library/domain/library-file.entity';

const mockLibraryFile = {
  ...mockBaseEntity,
  title: Random.lorem,
  description: Random.lorem,
  author: mockUserInstance,
  file: mockFileInstance,
  chapter: mockChapterInstance,
};

export const mockLibraryFileInstance = plainToInstance(LibraryFileEntity, mockLibraryFile);

const mockInstaller = {
  ...mockLibraryFile,
  type: InstallersEnum.WIN_64,
  version: '1.0.0',
  metadataDate: Random.datePast,
  metadataDateString: Random.datePast.toISOString(),
  changes: Random.lorem,
};

export const mockInstallerInstance = plainToInstance(LibraryFileEntity, mockInstaller);

describe('LibraryFileEntity', () => {
  test('Should update', () => {
    mockLibraryFileInstance.update('Title', mockChapterInstance, 'Description');

    expect(mockLibraryFileInstance.title).toBe('Title');
    expect(mockLibraryFileInstance.description).toBe('Description');

    mockLibraryFileInstance.title = Random.lorem;
    mockLibraryFileInstance.description = Random.lorem;
  });
});

import {
  chapterRepositoryMockProvider,
  fileRepositoryMockProvider,
  libraryFileRepositoryMockProvider,
  TestHelper,
  userRepositoryMockProvider,
} from '@core/test/test.helper';
import { CreateLibraryFileService } from '@modules/library/application/create-library-file.service';
import { InstallersEnum, LibraryFileEntity } from '@modules/library/domain/library-file.entity';
import { mockInstallerInstance, mockLibraryFileInstance } from '@modules/library/domain/library-file.entity.spec';
import { Random } from '@core/test/random';
import { EventActionEnum } from '@modules/event/application/create-event.service';
import { AddLibraryFileEvent } from '@modules/event/infrastructure/events/add-library-file.event';
import clearAllMocks = jest.clearAllMocks;

jest.mock('@modules/library/domain/library-file.entity');

const helpers = new TestHelper(
  libraryFileRepositoryMockProvider,
  userRepositoryMockProvider,
  fileRepositoryMockProvider,
  chapterRepositoryMockProvider,
);

describe('CreateLibraryFileService', () => {
  let createLibraryFileService: CreateLibraryFileService;

  beforeAll(async () => {
    [createLibraryFileService] = await helpers.beforeAll([CreateLibraryFileService]);
  });

  test('Should create library file and emit', async () => {
    //@ts-ignore
    LibraryFileEntity.mockImplementation(() => mockLibraryFileInstance);
    await createLibraryFileService.create(
      {
        title: Random.lorem,
        description: Random.lorem,
        authorId: Random.id,
        fileId: Random.id,
        chapterId: Random.id,
      },
      Random.id,
    );

    const mockLibraryFileRepository = helpers.getProviderValueByToken('LibraryFileRepository');
    const mockEventEmitter = helpers.getProviderValueByToken('EventEmitter2');

    expect(mockEventEmitter.emit).toHaveBeenCalledTimes(1);
    expect(mockEventEmitter.emit).toHaveBeenCalledWith(
      EventActionEnum.ADD_LIBRARY_FILE,
      new AddLibraryFileEvent(Random.id, Random.id),
    );
    expect(mockLibraryFileRepository.save).toHaveBeenCalledTimes(1);
    expect(mockLibraryFileRepository.save).toHaveBeenCalledWith(mockLibraryFileInstance);
  });

  test('Should create installer and emit', async () => {
    //@ts-ignore
    LibraryFileEntity.mockImplementation(() => mockInstallerInstance);
    await createLibraryFileService.createInstaller(
      {
        title: Random.lorem,
        fileId: Random.id,
        type: InstallersEnum.WIN_64,
        authorId: Random.id,
        description: Random.lorem,
        changes: Random.lorem,
        chapterId: Random.id,
        version: Random.lorem,
        metadataDate: Random.datePast.toISOString(),
      },
      Random.id,
    );

    const mockLibraryFileRepository = helpers.getProviderValueByToken('LibraryFileRepository');
    const mockEventEmitter = helpers.getProviderValueByToken('EventEmitter2');

    expect(mockEventEmitter.emit).toHaveBeenCalledTimes(1);
    expect(mockEventEmitter.emit).toHaveBeenCalledWith(
      EventActionEnum.ADD_INSTALLER,
      new AddLibraryFileEvent(Random.id, Random.id),
    );
    expect(mockLibraryFileRepository.save).toHaveBeenCalledTimes(1);
    expect(mockLibraryFileRepository.save).toHaveBeenCalledWith(mockInstallerInstance);
  });

  afterEach(() => {
    clearAllMocks();
  });
});

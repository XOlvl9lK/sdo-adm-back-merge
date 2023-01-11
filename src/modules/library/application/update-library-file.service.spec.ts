import { chapterRepositoryMockProvider, libraryFileRepositoryMockProvider, TestHelper } from '@core/test/test.helper';
import { UpdateLibraryFileService } from '@modules/library/application/update-library-file.service';
import { Random } from '@core/test/random';
import { EventActionEnum } from '@modules/event/application/create-event.service';
import { UpdateEntityEvent } from '@modules/event/infrastructure/events/update-entity.event';
import { mockLibraryFileInstance } from '@modules/library/domain/library-file.entity.spec';

const helpers = new TestHelper(libraryFileRepositoryMockProvider, chapterRepositoryMockProvider);

describe('UpdateLibraryFileService', () => {
  let updateLibraryFileService: UpdateLibraryFileService;

  beforeAll(async () => {
    [updateLibraryFileService] = await helpers.beforeAll([UpdateLibraryFileService]);
  });

  test('Should update library file and emit', async () => {
    await updateLibraryFileService.update(
      {
        libraryFileId: Random.id,
        title: Random.lorem,
        description: Random.lorem,
        chapterId: Random.id,
      },
      Random.id,
    );

    const mockLibraryFileRepository = helpers.getProviderValueByToken('LibraryFileRepository');
    const mockEventEmitter = helpers.getProviderValueByToken('EventEmitter2');

    expect(mockEventEmitter.emit).toHaveBeenCalledTimes(1);
    expect(mockEventEmitter.emit).toHaveBeenCalledWith(
      EventActionEnum.UPDATE_ENTITY,
      new UpdateEntityEvent('файл библиотеки', Random.id, 'Библиотека', mockLibraryFileInstance),
    );
    expect(mockLibraryFileRepository.save).toHaveBeenCalledTimes(1);
    expect(mockLibraryFileRepository.save).toHaveBeenCalledWith(mockLibraryFileInstance);
  });
});

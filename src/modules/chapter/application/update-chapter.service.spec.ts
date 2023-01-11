import { chapterRepositoryMockProvider, TestHelper } from '@core/test/test.helper';
import { UpdateChapterService } from '@modules/chapter/application/update-chapter.service';
import { Random } from '@core/test/random';
import { mockChapterInstance } from '@modules/chapter/domain/chapter.entity.spec';
import { EventActionEnum } from '@modules/event/application/create-event.service';
import { UpdateEntityEvent } from '@modules/event/infrastructure/events/update-entity.event';

const helpers = new TestHelper(chapterRepositoryMockProvider);

describe('UpdateChapterService', () => {
  let updateChapterService: UpdateChapterService;

  beforeAll(async () => {
    [updateChapterService] = await helpers.beforeAll([UpdateChapterService]);
  });

  test('Should update chapter and emit', async () => {
    await updateChapterService.update(
      {
        id: Random.id,
        title: Random.lorem,
        description: Random.lorem,
      },
      Random.id,
    );

    const mockChapterRepository = helpers.getProviderValueByToken('ChapterRepository');
    const mockEventEmitter = helpers.getProviderValueByToken('EventEmitter2');

    expect(mockChapterRepository.save).toHaveBeenCalledTimes(1);
    expect(mockChapterRepository.save).toHaveBeenCalledWith(mockChapterInstance);
    expect(mockEventEmitter.emit).toHaveBeenCalledTimes(1);
    expect(mockEventEmitter.emit).toHaveBeenCalledWith(
      EventActionEnum.UPDATE_ENTITY,
      new UpdateEntityEvent('раздел обучения', Random.id, 'Разделы обучения', mockChapterInstance),
    );
  });
});

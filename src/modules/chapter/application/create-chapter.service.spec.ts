import { chapterRepositoryMockProvider, TestHelper } from '@core/test/test.helper';
import { CreateChapterService } from '@modules/chapter/application/create-chapter.service';
import { Random } from '@core/test/random';
import { ChapterEntity } from '@modules/chapter/domain/chapter.entity';
import { mockChapterInstance } from '@modules/chapter/domain/chapter.entity.spec';
import { CreateEntityEvent } from '@modules/event/infrastructure/events/create-entity.event';
import { EventActionEnum } from '@modules/event/application/create-event.service';
jest.mock('@modules/chapter/domain/chapter.entity');
//@ts-ignore
ChapterEntity.mockImplementation(() => mockChapterInstance);

const helpers = new TestHelper(chapterRepositoryMockProvider);

describe('CreateChapterService', () => {
  let createChapterService: CreateChapterService;

  beforeAll(async () => {
    [createChapterService] = await helpers.beforeAll([CreateChapterService]);
  });

  test('Should create chapter and emit', async () => {
    await createChapterService.create(
      {
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
      EventActionEnum.CREATE_ENTITY,
      new CreateEntityEvent('раздел', Random.id, Random.id, 'Разделы элементов обучения'),
    );
  });

  test('Should throw if chapter already exists', async () => {
    const mockChapterRepository = helpers.getProviderValueByToken('ChapterRepository');
    jest.spyOn(mockChapterRepository, 'isAlreadyExists').mockResolvedValue(true);

    await expect(async () => {
      await createChapterService.create(
        {
          title: Random.lorem,
          description: Random.lorem,
        },
        Random.id,
      );
    }).rejects.toThrow();
  });
});

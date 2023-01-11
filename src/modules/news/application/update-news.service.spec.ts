import { newsGroupRepositoryMockProvider, newsRepositoryMockProvider, TestHelper } from '@core/test/test.helper';
import { UpdateNewsService } from '@modules/news/application/update-news.service';
import { Random } from '@core/test/random';
import { mockNewsInstance } from '@modules/news/domain/news.entity.spec';
import clearAllMocks = jest.clearAllMocks;

const helpers = new TestHelper(newsRepositoryMockProvider, newsGroupRepositoryMockProvider);

describe('UpdateNewsService', () => {
  let updateNewsService: UpdateNewsService;

  beforeAll(async () => {
    [updateNewsService] = await helpers.beforeAll([UpdateNewsService]);
  });

  test('Should update news and emit', async () => {
    await updateNewsService.update(
      {
        id: Random.id,
        newsGroupId: Random.id,
        preview: Random.lorem,
        content: Random.lorem,
        title: Random.lorem,
        isPublished: true,
        createdAt: new Date(10000).toISOString(),
      },
      Random.id,
    );

    const mockEventEmitter = helpers.getProviderValueByToken('EventEmitter2');
    const mockNewsRepository = helpers.getProviderValueByToken('NewsRepository');

    expect(mockEventEmitter.emit).toHaveBeenCalledTimes(1);
    expect(mockNewsRepository.save).toHaveBeenCalledTimes(1);
  });

  test('Should move news', async () => {
    await updateNewsService.move({
      newsIds: Random.ids,
      newsGroupToId: Random.id,
    });

    const mockNewsRepository = helpers.getProviderValueByToken('NewsRepository');

    expect(mockNewsRepository.save).toHaveBeenCalledTimes(1);
    expect(mockNewsRepository.save).toHaveBeenCalledWith([mockNewsInstance]);
  });

  afterEach(() => {
    clearAllMocks();
  });
});

import {
  newsGroupRepositoryMockProvider,
  newsRepositoryMockProvider,
  TestHelper,
  userRepositoryMockProvider,
} from '@core/test/test.helper';
import { CreateNewsService } from '@modules/news/application/create-news.service';
import { Random } from '@core/test/random';
import { NewsEntity } from '@modules/news/domain/news.entity';
import { mockNewsInstance } from '@modules/news/domain/news.entity.spec';
jest.mock('@modules/news/domain/news.entity');
//@ts-ignore
NewsEntity.mockImplementation(() => mockNewsInstance);

const helpers = new TestHelper(newsRepositoryMockProvider, newsGroupRepositoryMockProvider, userRepositoryMockProvider);

describe('CreateNewsService', () => {
  let createNewsService: CreateNewsService;

  beforeAll(async () => {
    [createNewsService] = await helpers.beforeAll([CreateNewsService]);
  });

  test('Should create news and emit', async () => {
    await createNewsService.create(
      {
        title: Random.lorem,
        content: Random.lorem,
        isPublished: true,
        preview: Random.lorem,
        newsGroupId: Random.id,
        createdAt: Random.datePast.toISOString(),
      },
      Random.id,
    );

    const mockNewsRepository = helpers.getProviderValueByToken('NewsRepository');
    const mockEventEmitter = helpers.getProviderValueByToken('EventEmitter2');

    expect(mockEventEmitter.emit).toHaveBeenCalledTimes(1);
    expect(mockNewsRepository.save).toHaveBeenCalledTimes(1);
    expect(mockNewsRepository.save).toHaveBeenCalledWith(mockNewsInstance);
  });
});

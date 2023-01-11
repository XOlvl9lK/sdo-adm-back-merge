import { newsRepositoryMockProvider, TestHelper } from '@core/test/test.helper';
import { FindNewsService } from '@modules/news/application/find-news.service';
import { mockNewsInstance } from '@modules/news/domain/news.entity.spec';
import { Random } from '@core/test/random';

const helpers = new TestHelper(newsRepositoryMockProvider);

describe('FindNewsService', () => {
  let findNewsService: FindNewsService;

  beforeAll(async () => {
    [findNewsService] = await helpers.beforeAll([FindNewsService]);
  });

  test('Should return all news and count', async () => {
    const result = await findNewsService.findAll({});

    expect(result).toEqual([[mockNewsInstance], Random.number]);
  });

  test('Should return news by id', async () => {
    const result = await findNewsService.findById(Random.id);

    expect(result).toEqual(mockNewsInstance);
  });

  test('Should return news by group id and count', async () => {
    const result = await findNewsService.findByGroupId(Random.id, {});

    expect(result).toEqual([[mockNewsInstance], Random.number]);
  });
});

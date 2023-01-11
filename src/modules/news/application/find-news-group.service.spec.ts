import { newsGroupRepositoryMockProvider, newsRepositoryMockProvider, TestHelper } from '@core/test/test.helper';
import { FindNewsGroupService } from '@modules/news/application/find-news-group.service';
import { mockNewsGroupInstance } from '@modules/news/domain/news-group.entity.spec';
import { Random } from '@core/test/random';
import { mockNewsInstance } from '@modules/news/domain/news.entity.spec';

const helpers = new TestHelper(newsGroupRepositoryMockProvider, newsRepositoryMockProvider);

describe('FindNewsGroupService', () => {
  let findNewsGroupService: FindNewsGroupService;

  beforeAll(async () => {
    [findNewsGroupService] = await helpers.beforeAll([FindNewsGroupService]);
  });

  test('Should return all news groups and emit', async () => {
    const result = await findNewsGroupService.findAll({});

    expect(result).toEqual([[mockNewsGroupInstance], Random.number]);
  });

  test('Should return news group by id', async () => {
    const result = await findNewsGroupService.findById(Random.id, {});

    expect(result).toEqual({
      total: Random.number,
      data: {
        ...mockNewsGroupInstance,
        news: [mockNewsInstance],
      },
    });
  });
});

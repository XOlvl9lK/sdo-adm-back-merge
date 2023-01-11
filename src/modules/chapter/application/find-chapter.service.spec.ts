import { chapterRepositoryMockProvider, TestHelper } from '@core/test/test.helper';
import { FindChapterService } from '@modules/chapter/application/find-chapter.service';
import { mockChapterInstance } from '@modules/chapter/domain/chapter.entity.spec';
import { Random } from '@core/test/random';

const helpers = new TestHelper(chapterRepositoryMockProvider);

describe('FindChapterService', () => {
  let findChapterService: FindChapterService;

  beforeAll(async () => {
    [findChapterService] = await helpers.beforeAll([FindChapterService]);
  });

  test('Should return all chapters and count', async () => {
    const result = await findChapterService.findAll({});

    expect(result).toEqual([[mockChapterInstance], Random.number]);
  });

  test('Should return all chapters without pagination', async () => {
    const result = await findChapterService.findAllWithoutPagination({});

    expect(result).toEqual([mockChapterInstance]);
  });

  test('Should return chapter by id', async () => {
    const result = await findChapterService.findById(Random.id);

    expect(result).toEqual(mockChapterInstance);
  });
});

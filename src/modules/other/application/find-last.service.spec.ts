import {
  educationElementRepositoryMockProvider,
  libraryFileRepositoryMockProvider,
  newsRepositoryMockProvider,
  TestHelper,
} from '@core/test/test.helper';
import { FindLastService } from '@modules/other/application/find-last.service';
import { mockNewsInstance } from '@modules/news/domain/news.entity.spec';
import { mockTestInstance } from '@modules/test/domain/test.entity.spec';
import { mockLibraryFileInstance } from '@modules/library/domain/library-file.entity.spec';

const helpers = new TestHelper(
  newsRepositoryMockProvider,
  educationElementRepositoryMockProvider,
  libraryFileRepositoryMockProvider,
);

describe('FindLastService', () => {
  let findLastService: FindLastService;

  beforeAll(async () => {
    [findLastService] = await helpers.beforeAll([FindLastService]);
  });

  test('Should return last entities', async () => {
    const result = await findLastService.getLast();

    expect(result).toEqual({
      lastNews: [mockNewsInstance],
      lastEducationElements: [mockTestInstance],
      lastLibraryFiles: [mockLibraryFileInstance],
    });
  });
});

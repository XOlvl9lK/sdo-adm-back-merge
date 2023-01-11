import { TestHelper } from '@core/test/test.helper';
import { LastController } from '@modules/other/controllers/last.controller';
import { FindLastService } from '@modules/other/application/find-last.service';
import { mockNewsInstance } from '@modules/news/domain/news.entity.spec';
import { mockTestInstance } from '@modules/test/domain/test.entity.spec';
import { mockLibraryFileInstance } from '@modules/library/domain/library-file.entity.spec';

const helpers = new TestHelper();

describe('LastController', () => {
  let lastController: LastController;

  beforeAll(async () => {
    [lastController] = await helpers.beforeAll(
      [LastController],
      [
        {
          provide: FindLastService,
          useValue: {
            getLast: jest.fn().mockResolvedValue({
              lastNews: [mockNewsInstance],
              lastEducationElements: [mockTestInstance],
              lastLibraryFiles: [mockLibraryFileInstance],
            }),
          },
        },
      ],
      [LastController],
    );
  });

  test('Should return last entities', async () => {
    const result = await lastController.getLast();

    expect(result).toEqual({
      lastNews: [mockNewsInstance],
      lastEducationElements: [mockTestInstance],
      lastLibraryFiles: [mockLibraryFileInstance],
    });
  });
});

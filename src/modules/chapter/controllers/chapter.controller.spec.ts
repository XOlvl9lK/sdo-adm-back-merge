import { TestHelper } from '@core/test/test.helper';
import { CreateChapterService } from '@modules/chapter/application/create-chapter.service';
import { FindChapterService } from '@modules/chapter/application/find-chapter.service';
import { mockChapterInstance } from '@modules/chapter/domain/chapter.entity.spec';
import { UpdateChapterService } from '@modules/chapter/application/update-chapter.service';
import { ChapterController } from '@modules/chapter/controllers/chapter.controller';
import { Random } from '@core/test/random';

const helpers = new TestHelper(
  { type: 'createService', provide: CreateChapterService },
  {
    type: 'findService',
    provide: FindChapterService,
    mockValue: mockChapterInstance,
    extend: [
      {
        method: 'findAllWithoutPagination',
        mockImplementation: jest.fn().mockResolvedValue([mockChapterInstance]),
      },
    ],
  },
  { type: 'updateService', provide: UpdateChapterService },
);

describe('ChapterController', () => {
  let chapterController: ChapterController;

  beforeAll(async () => {
    [chapterController] = await helpers.beforeAll([ChapterController], [], [ChapterController]);
  });

  test('Should return all chapters and count', async () => {
    const result = await chapterController.getAll({});

    expect(result).toEqual({
      total: Random.number,
      data: [mockChapterInstance],
    });
  });

  test('Should return all chapters without pagination', async () => {
    const result = await chapterController.getAllWithoutPagination({});

    expect(result).toEqual([mockChapterInstance]);
  });

  test('Should return chapter by id', async () => {
    const result = await chapterController.getById(Random.id);

    expect(result).toEqual(mockChapterInstance);
  });

  test('Should call create', async () => {
    await chapterController.create(
      {
        title: Random.lorem,
        description: Random.lorem,
      },
      Random.id,
    );

    const mockCreateChapterService = helpers.getProviderValueByToken('CreateChapterService');

    expect(mockCreateChapterService.create).toHaveBeenCalledTimes(1);
    expect(mockCreateChapterService.create).toHaveBeenCalledWith(
      {
        title: Random.lorem,
        description: Random.lorem,
      },
      Random.id,
    );
  });

  test('Should call update', async () => {
    await chapterController.update(
      {
        id: Random.id,
        title: Random.lorem,
        description: Random.lorem,
      },
      Random.id,
    );

    const mockUpdateChapterService = helpers.getProviderValueByToken('UpdateChapterService');

    expect(mockUpdateChapterService.update).toHaveBeenCalledTimes(1);
    expect(mockUpdateChapterService.update).toHaveBeenCalledWith(
      {
        id: Random.id,
        title: Random.lorem,
        description: Random.lorem,
      },
      Random.id,
    );
  });
});

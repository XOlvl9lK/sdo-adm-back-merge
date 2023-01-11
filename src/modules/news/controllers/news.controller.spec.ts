import { TestHelper } from '@core/test/test.helper';
import { NewsController } from '@modules/news/controllers/news.controller';
import { CreateNewsService } from '@modules/news/application/create-news.service';
import { FindNewsService } from '@modules/news/application/find-news.service';
import { mockNewsInstance } from '@modules/news/domain/news.entity.spec';
import { Random } from '@core/test/random';
import { UpdateNewsService } from '@modules/news/application/update-news.service';
import clearAllMocks = jest.clearAllMocks;

const helpers = new TestHelper();

describe('NewsController', () => {
  let newsController: NewsController;

  beforeAll(async () => {
    [newsController] = await helpers.beforeAll(
      [NewsController],
      [
        {
          provide: CreateNewsService,
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: FindNewsService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([[mockNewsInstance], Random.number]),
            findById: jest.fn().mockResolvedValue(mockNewsInstance),
            findByGroupId: jest.fn().mockResolvedValue([[mockNewsInstance], Random.number]),
          },
        },
        {
          provide: UpdateNewsService,
          useValue: {
            update: jest.fn(),
            move: jest.fn(),
          },
        },
      ],
      [NewsController],
    );
  });

  test('Should return all news and count', async () => {
    const result = await newsController.getAll({});

    expect(result).toEqual({
      data: [mockNewsInstance],
      total: Random.number,
    });
  });

  test('Should return news by id', async () => {
    const result = await newsController.getById(Random.id);

    expect(result).toEqual(mockNewsInstance);
  });

  test('Should return news by group id and count', async () => {
    const result = await newsController.getByGroupId(Random.id, {});

    expect(result).toEqual({
      data: [mockNewsInstance],
      total: Random.number,
    });
  });

  test('Should call create', async () => {
    await newsController.create(
      {
        createdAt: new Date(10000).toISOString(),
        isPublished: true,
        content: Random.lorem,
        preview: Random.lorem,
        title: Random.lorem,
        newsGroupId: Random.id,
      },
      Random.id,
    );

    const mockCreateNewsService = helpers.getProviderValueByToken('CreateNewsService');

    expect(mockCreateNewsService.create).toHaveBeenCalledTimes(1);
    expect(mockCreateNewsService.create).toHaveBeenCalledWith(
      {
        createdAt: new Date(10000).toISOString(),
        isPublished: true,
        content: Random.lorem,
        preview: Random.lorem,
        title: Random.lorem,
        newsGroupId: Random.id,
      },
      Random.id,
    );
  });

  test('Should call update', async () => {
    await newsController.update(
      {
        id: Random.id,
        createdAt: new Date(10000).toISOString(),
        isPublished: true,
        content: Random.lorem,
        preview: Random.lorem,
        title: Random.lorem,
        newsGroupId: Random.id,
      },
      Random.id,
    );

    const mockUpdateNewsService = helpers.getProviderValueByToken('UpdateNewsService');

    expect(mockUpdateNewsService.update).toHaveBeenCalledTimes(1);
    expect(mockUpdateNewsService.update).toHaveBeenCalledWith(
      {
        id: Random.id,
        createdAt: new Date(10000).toISOString(),
        isPublished: true,
        content: Random.lorem,
        preview: Random.lorem,
        title: Random.lorem,
        newsGroupId: Random.id,
      },
      Random.id,
    );
  });

  test('Should call move', async () => {
    await newsController.move({
      newsIds: Random.ids,
      newsGroupToId: Random.id,
    });

    const mockUpdateNewsService = helpers.getProviderValueByToken('UpdateNewsService');

    expect(mockUpdateNewsService.move).toHaveBeenCalledTimes(1);
    expect(mockUpdateNewsService.move).toHaveBeenCalledWith({
      newsIds: Random.ids,
      newsGroupToId: Random.id,
    });
  });

  afterEach(() => {
    clearAllMocks();
  });
});

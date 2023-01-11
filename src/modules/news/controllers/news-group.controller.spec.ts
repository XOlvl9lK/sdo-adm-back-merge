import { TestHelper } from '@core/test/test.helper';
import { NewsGroupController } from '@modules/news/controllers/news-group.controller';
import { FindNewsGroupService } from '@modules/news/application/find-news-group.service';
import { mockNewsGroupInstance } from '@modules/news/domain/news-group.entity.spec';
import { Random } from '@core/test/random';
import { mockNewsInstance } from '@modules/news/domain/news.entity.spec';
import { CreateNewsGroupService } from '@modules/news/application/create-news-group.service';
import { UpdateNewsGroupService } from '@modules/news/application/update-news-group.service';

const helpers = new TestHelper();

describe('NewsGroupController', () => {
  let newsGroupController: NewsGroupController;

  beforeAll(async () => {
    [newsGroupController] = await helpers.beforeAll(
      [NewsGroupController],
      [
        {
          provide: FindNewsGroupService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([[mockNewsGroupInstance], Random.number]),
            findById: jest.fn().mockResolvedValue({
              total: Random.number,
              data: {
                ...mockNewsGroupInstance,
                news: [mockNewsInstance],
              },
            }),
          },
        },
        {
          provide: CreateNewsGroupService,
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: UpdateNewsGroupService,
          useValue: {
            update: jest.fn(),
          },
        },
      ],
      [NewsGroupController],
    );
  });

  test('Should return all news groups and count', async () => {
    const result = await newsGroupController.getAll({});

    expect(result).toEqual({
      data: [mockNewsGroupInstance],
      total: Random.number,
    });
  });

  test('Should return news group by id', async () => {
    const result = await newsGroupController.getById(Random.id, {});

    expect(result).toEqual({
      total: Random.number,
      data: {
        ...mockNewsGroupInstance,
        news: [mockNewsInstance],
      },
    });
  });

  test('Should call create', async () => {
    await newsGroupController.create(
      {
        parentGroupId: Random.id,
        title: Random.lorem,
        description: Random.lorem,
      },
      Random.id,
    );

    const mockCreateNewsGroupService = helpers.getProviderValueByToken('CreateNewsGroupService');

    expect(mockCreateNewsGroupService.create).toHaveBeenCalledTimes(1);
    expect(mockCreateNewsGroupService.create).toHaveBeenCalledWith(
      {
        parentGroupId: Random.id,
        title: Random.lorem,
        description: Random.lorem,
      },
      Random.id,
    );
  });

  test('Should call update', async () => {
    await newsGroupController.update(
      {
        id: Random.id,
        title: Random.lorem,
        description: Random.lorem,
        parentGroupId: Random.id,
      },
      Random.id,
    );

    const mockUpdateNewsGroupService = helpers.getProviderValueByToken('UpdateNewsGroupService');

    expect(mockUpdateNewsGroupService.update).toHaveBeenCalledTimes(1);
    expect(mockUpdateNewsGroupService.update).toHaveBeenCalledWith(
      {
        id: Random.id,
        title: Random.lorem,
        description: Random.lorem,
        parentGroupId: Random.id,
      },
      Random.id,
    );
  });
});

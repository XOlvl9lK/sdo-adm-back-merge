import { newsGroupRepositoryMockProvider, TestHelper } from '@core/test/test.helper';
import { CreateNewsGroupService } from '@modules/news/application/create-news-group.service';
import { Random } from '@core/test/random';
import { NewsGroupEntity } from '@modules/news/domain/news-group.entity';
import { mockNewsGroupInstance } from '@modules/news/domain/news-group.entity.spec';
jest.mock('@modules/news/domain/news-group.entity');
//@ts-ignore
NewsGroupEntity.mockImplementation(() => mockNewsGroupInstance);

const helpers = new TestHelper(newsGroupRepositoryMockProvider);

describe('CreateNewsGroupService', () => {
  let createNewsGroupService: CreateNewsGroupService;

  beforeAll(async () => {
    [createNewsGroupService] = await helpers.beforeAll([CreateNewsGroupService]);
  });

  test('Should create news group and emit', async () => {
    await createNewsGroupService.create(
      {
        title: Random.lorem,
        description: Random.lorem,
        parentGroupId: Random.id,
      },
      Random.id,
    );

    const mockNewsGroupRepository = helpers.getProviderValueByToken('NewsGroupRepository');
    const mockEventEmitter = helpers.getProviderValueByToken('EventEmitter2');

    expect(mockEventEmitter.emit).toHaveBeenCalledTimes(1);
    expect(mockNewsGroupRepository.save).toHaveBeenCalledTimes(1);
    expect(mockNewsGroupRepository.save).toHaveBeenCalledWith(mockNewsGroupInstance);
  });
});

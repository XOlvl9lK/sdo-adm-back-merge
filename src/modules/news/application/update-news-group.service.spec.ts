import { newsGroupRepositoryMockProvider, TestHelper } from '@core/test/test.helper';
import { UpdateNewsGroupService } from '@modules/news/application/update-news-group.service';
import { Random } from '@core/test/random';
import { mockNewsGroupInstance } from '@modules/news/domain/news-group.entity.spec';

const helpers = new TestHelper(newsGroupRepositoryMockProvider);

describe('UpdateNewsGroupService', () => {
  let updateNewsGroupService: UpdateNewsGroupService;

  beforeAll(async () => {
    [updateNewsGroupService] = await helpers.beforeAll([UpdateNewsGroupService]);
  });

  test('Should update news group and emit', async () => {
    await updateNewsGroupService.update(
      {
        id: Random.id,
        title: 'Title',
        description: 'Description',
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

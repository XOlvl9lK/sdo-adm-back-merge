import { mockBaseEntity } from '@core/domain/base.entity.mock';
import { Random } from '@core/test/random';
import { plainToInstance } from 'class-transformer';
import { NewsGroupEntity } from '@modules/news/domain/news-group.entity';

const mockNewsGroup = {
  ...mockBaseEntity,
  title: Random.lorem,
  description: Random.lorem,
};

export const mockNewsGroupInstance = plainToInstance(NewsGroupEntity, mockNewsGroup);

describe('NewsGroupEntity', () => {
  test('Should update news group', () => {
    mockNewsGroupInstance.update('Title', 'Description');

    expect(mockNewsGroupInstance.title).toBe('Title');
    expect(mockNewsGroupInstance.description).toBe('Description');

    mockNewsGroupInstance.title = Random.lorem;
    mockNewsGroupInstance.description = Random.lorem;
  });
});

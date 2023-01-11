import { mockBaseEntity } from '@core/domain/base.entity.mock';
import { Random } from '@core/test/random';
import { mockUserInstance } from '@modules/user/domain/user.entity.spec';
import { mockNewsGroupInstance } from '@modules/news/domain/news-group.entity.spec';
import { plainToInstance } from 'class-transformer';
import { NewsEntity } from '@modules/news/domain/news.entity';

const mockNews = {
  ...mockBaseEntity,
  title: Random.lorem,
  preview: Random.lorem,
  content: Random.lorem,
  isPublished: true,
  publishDate: Random.datePast,
  author: mockUserInstance,
  newsGroup: mockNewsGroupInstance,
  news_group_id: Random.id,
};

export const mockNewsInstance = plainToInstance(NewsEntity, mockNews);

describe('NewsEntity', () => {
  test('Should update news', () => {
    mockNewsInstance.update('Title', '<p>Content</p>', 'preview', new Date(10000), true, mockNewsGroupInstance);

    expect(mockNewsInstance.title).toBe('Title');
    expect(mockNewsInstance.content).toBe('<p>Content</p>');
    expect(mockNewsInstance.preview).toBe('preview');
    expect(mockNewsInstance.createdAt).toEqual(new Date(10000));

    mockNewsInstance.title = Random.lorem;
    mockNewsInstance.content = Random.lorem;
    mockNewsInstance.preview = Random.lorem;
    mockNewsInstance.createdAt = Random.datePast;
  });
});

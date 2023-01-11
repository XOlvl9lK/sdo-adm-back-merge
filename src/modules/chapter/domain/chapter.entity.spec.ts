import { mockBaseEntity } from '@core/domain/base.entity.mock';
import { Random } from '@core/test/random';
import { plainToInstance } from 'class-transformer';
import { ChapterEntity } from '@modules/chapter/domain/chapter.entity';

const mockChapter = {
  ...mockBaseEntity,
  title: Random.lorem,
  description: Random.lorem,
};

export const mockChapterInstance = plainToInstance(ChapterEntity, mockChapter);

describe('ChapterEntity', () => {
  test('Should update', () => {
    mockChapterInstance.update('Title', 'Description');

    expect(mockChapterInstance.title).toBe('Title');
    expect(mockChapterInstance.description).toBe('Description');

    mockChapterInstance.title = Random.lorem;
    mockChapterInstance.description = Random.lorem;
  });
});

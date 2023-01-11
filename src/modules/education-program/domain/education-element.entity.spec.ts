import { mockBaseEntity } from '@core/domain/base.entity.mock';
import { Random } from '@core/test/random';
import { mockChapterInstance } from '@modules/chapter/domain/chapter.entity.spec';

export const mockEducationElement = {
  ...mockBaseEntity,
  title: Random.lorem,
  description: Random.lorem,
  chapter: mockChapterInstance,
  available: true,
  isSelfAssignmentAvailable: true,
  duration: Random.number,
};

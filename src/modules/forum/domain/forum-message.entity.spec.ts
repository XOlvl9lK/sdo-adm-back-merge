import { mockBaseEntity } from '@core/domain/base.entity.mock';
import { mockUserInstance } from '@modules/user/domain/user.entity.spec';
import { plainToInstance } from 'class-transformer';
import { ThemeEntity } from '@modules/forum/domain/theme.entity';
import { Random } from '@core/test/random';
import { ForumEntity } from '@modules/forum/domain/forum.entity';
import { ForumMessageEntity } from '@modules/forum/domain/forum-message.entity';

const mockForumMessage = {
  ...mockBaseEntity,
  author: mockUserInstance,
  theme: plainToInstance(ThemeEntity, {
    ...mockBaseEntity,
    title: Random.lorem,
    description: Random.lorem,
    author: mockUserInstance,
    forum: plainToInstance(ForumEntity, {
      ...mockBaseEntity,
      title: Random.lorem,
      description: Random.lorem,
      totalThemes: Random.number,
      totalMessages: Random.number,
    }),
    totalMessages: Random.lorem,
    lastMessage: plainToInstance(ForumMessageEntity, {
      ...mockBaseEntity,
      author: mockUserInstance,
      message: Random.lorem,
      isFixed: false,
    }),
    isFixed: false,
    isClosed: false,
    leavedLinks: [Random.lorem],
  }),
  message: Random.lorem,
  isFixed: false,
};

export const mockForumMessageInstance = plainToInstance(ForumMessageEntity, mockForumMessage);

describe('ForumMessageEntity', () => {
  const newTheme = plainToInstance(ThemeEntity, {
    ...mockBaseEntity,
    title: Random.lorem,
    description: Random.lorem,
    author: mockUserInstance,
    totalMessages: Random.lorem,
    isFixed: true,
    isClosed: true,
  });

  test('Should move message', () => {
    mockForumMessageInstance.move(newTheme, true);

    expect(mockForumMessageInstance.theme).toEqual(newTheme);
    expect(mockForumMessageInstance.isFixed).toBe(true);
  });

  test('Should fix message', () => {
    mockForumMessageInstance.isFixed = false;
    mockForumMessageInstance.fix();

    expect(mockForumMessageInstance.isFixed).toBe(true);
  });

  test('Should unpin message', () => {
    mockForumMessageInstance.isFixed = true;
    mockForumMessageInstance.unpin();

    expect(mockForumMessageInstance.isFixed).toBe(false);
  });
});

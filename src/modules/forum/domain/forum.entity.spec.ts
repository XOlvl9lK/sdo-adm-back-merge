import { mockBaseEntity } from '@core/domain/base.entity.mock';
import { Random } from '@core/test/random';
import { mockForumMessageInstance } from '@modules/forum/domain/forum-message.entity.spec';
import { mockThemeInstance } from '@modules/forum/domain/theme.entity.spec';
import { plainToInstance } from 'class-transformer';
import { ForumEntity } from '@modules/forum/domain/forum.entity';
import { ForumMessageEntity } from '@modules/forum/domain/forum-message.entity';
import { mockUserInstance } from '@modules/user/domain/user.entity.spec';
import { ThemeEntity } from '@modules/forum/domain/theme.entity';

const mockForum = {
  ...mockBaseEntity,
  title: Random.lorem,
  description: Random.lorem,
  totalThemes: Random.number,
  totalMessages: Random.number,
  lastMessage: mockForumMessageInstance,
  lastRedactedTheme: mockThemeInstance,
  order: Random.number,
  isDeleted: false,
};

export const mockForumInstance = plainToInstance(ForumEntity, mockForum);

describe('ForumEntity', () => {
  const newMessage = plainToInstance(ForumMessageEntity, {
    ...mockBaseEntity,
    author: mockUserInstance,
    message: Random.lorem + Random.lorem,
    isFixed: true,
  });
  const newTheme = plainToInstance(ThemeEntity, {
    ...mockBaseEntity,
    title: Random.lorem,
    description: Random.lorem,
    author: mockUserInstance,
    totalMessages: Random.lorem,
    isFixed: true,
    isClosed: true,
  });

  test('Should add theme', () => {
    mockForumInstance.addTheme();

    expect(mockForumInstance.totalThemes).toBe(Random.number + 1);
  });

  test('Should add message', () => {
    mockForumInstance.addMessage(newMessage, newTheme);

    expect(mockForumInstance.lastMessage).toEqual(newMessage);
    expect(mockForumInstance.lastRedactedTheme).toEqual(newTheme);
  });

  test('Should update', () => {
    mockForumInstance.update('Title', 'Description');

    expect(mockForumInstance.title).toBe('Title');
    expect(mockForumInstance.description).toBe('Description');
  });
});

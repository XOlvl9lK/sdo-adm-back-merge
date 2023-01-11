import { mockBaseEntity } from '@core/domain/base.entity.mock';
import { Random } from '@core/test/random';
import { mockUserInstance } from '@modules/user/domain/user.entity.spec';
import { plainToInstance } from 'class-transformer';
import { ForumEntity } from '@modules/forum/domain/forum.entity';
import { ForumMessageEntity } from '@modules/forum/domain/forum-message.entity';
import { ThemeEntity } from '@modules/forum/domain/theme.entity';
import exp from 'constants';

const mockTheme = {
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
  totalMessages: Random.number,
  lastMessage: plainToInstance(ForumMessageEntity, {
    ...mockBaseEntity,
    author: mockUserInstance,
    message: Random.lorem,
    isFixed: false,
  }),
  isFixed: false,
  isClosed: false,
  leavedLinks: [Random.lorem],
};

export const mockThemeInstance = plainToInstance(ThemeEntity, mockTheme);

describe('ThemeEntity', () => {
  const newMessage = plainToInstance(ForumMessageEntity, {
    ...mockBaseEntity,
    author: mockUserInstance,
    message: Random.lorem + Random.lorem,
    isFixed: true,
  });
  const newForum = plainToInstance(ForumEntity, {
    ...mockBaseEntity,
    title: Random.lorem,
    description: Random.lorem,
    totalThemes: Random.number,
    totalMessages: Random.number,
  });

  test('Should add message', () => {
    mockThemeInstance.addMessage(newMessage, true);

    expect(mockThemeInstance.lastMessage).toEqual(newMessage);
    expect(mockThemeInstance.totalMessages).toBe(Random.number + 1);
  });

  test('Should subtract message', () => {
    mockThemeInstance.totalMessages = Random.number;
    mockThemeInstance.subtractMessage();

    expect(mockThemeInstance.totalMessages).toBe(Random.number - 1);
  });

  test('Should update', () => {
    mockThemeInstance.update('Title', newForum, 'Description');

    expect(mockThemeInstance.forum).toEqual(newForum);
    expect(mockThemeInstance.title).toBe('Title');
    expect(mockThemeInstance.description).toBe('Description');
  });

  test('Should close theme', () => {
    mockThemeInstance.isClosed = false;
    mockThemeInstance.close();

    expect(mockThemeInstance.isClosed).toBe(true);
  });

  test('Should open theme', () => {
    mockThemeInstance.isClosed = true;
    mockThemeInstance.open();

    expect(mockThemeInstance.isClosed).toBe(false);
  });

  test('Should fix theme', () => {
    mockThemeInstance.isFixed = false;
    mockThemeInstance.fix();

    expect(mockThemeInstance.isFixed).toBe(true);
  });

  test('Should unpin theme', () => {
    mockThemeInstance.isFixed = true;
    mockThemeInstance.unpin();

    expect(mockThemeInstance.isFixed).toBe(false);
  });
});

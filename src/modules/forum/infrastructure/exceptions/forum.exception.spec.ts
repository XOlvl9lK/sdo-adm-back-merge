import { ForumException } from '@modules/forum/infrastructure/exceptions/forum.exception';

describe('ForumException', () => {
  test('Should throw', () => {
    expect(() => {
      ForumException.NotFound();
    }).toThrow('Тема не найдена');
  });
});

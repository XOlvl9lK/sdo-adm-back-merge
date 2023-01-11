import { MessageException } from '@modules/messenger/infrastructure/exceptions/message.exception';

describe('MessageException', () => {
  test('Should throw error', () => {
    expect(() => {
      MessageException.NotFound();
    }).toThrow('Сообщение не найдено');
  });
});

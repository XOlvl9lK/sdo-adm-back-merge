import { AnswerException } from '@modules/test/infrastructure/exceptions/answer.exception';

describe('AnswerException', () => {
  test('Should throw', () => {
    expect(() => {
      AnswerException.NotFound();
    }).toThrow('Ответ с таким id не найден');
  });
});

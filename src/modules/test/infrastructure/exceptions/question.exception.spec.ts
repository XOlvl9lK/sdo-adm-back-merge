import { QuestionException } from '@modules/test/infrastructure/exceptions/question.exception';

describe('QuestionException', () => {
  test('Should throw', () => {
    expect(() => {
      QuestionException.NotFound();
    }).toThrow('Вопрос с таким id не найден');
  });
});

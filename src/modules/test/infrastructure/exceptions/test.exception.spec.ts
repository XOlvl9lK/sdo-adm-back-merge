import { TestException } from '@modules/test/infrastructure/exceptions/test.exception';

describe('TestException', () => {
  test('Should throw', () => {
    expect(() => {
      TestException.NotFound();
    }).toThrow('Тест с таким id не найден');
  });
});

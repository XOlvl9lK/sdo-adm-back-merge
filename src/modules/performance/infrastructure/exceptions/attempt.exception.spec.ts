import { AttemptException } from '@modules/performance/infrastructure/exceptions/attempt.exception';

describe('AttemptException', () => {
  test('Should throw', () => {
    expect(() => {
      AttemptException.NotFound();
    }).toThrow('Статистика по попытке не найдена');
  });
});

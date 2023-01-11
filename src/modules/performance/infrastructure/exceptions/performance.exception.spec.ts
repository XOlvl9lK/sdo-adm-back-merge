import { PerformanceException } from '@modules/performance/infrastructure/exceptions/performance.exception';

describe('PerformanceException', () => {
  test('Should throw', () => {
    expect(() => {
      // PerformanceException.NotEnoughAttempts()
    }).toThrow('Попытки закончились');
  });

  test('Should throw', () => {
    expect(() => {
      // PerformanceException.NotFound()
    }).toThrow('Запись об успеваемости не найдена');
  });

  test('Should throw', () => {
    expect(() => {
      // PerformanceException.NotAllowedToIssuanceCertificate()
    }).toThrow('По данной успеваемости недопустимо формирование сертификата');
  });

  test('Should throw', () => {
    expect(() => {
      // PerformanceException.CompleteBeforeIssuanceCertificate()
    }).toThrow('Необходимо завершить элемент обучения перед формированием сертификата');
  });
});

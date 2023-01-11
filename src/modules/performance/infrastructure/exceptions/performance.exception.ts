import { EventLogException } from '@core/exceptions/base.exception';
import { HttpStatus } from '@nestjs/common';

export class PerformanceException extends EventLogException {
  static NotEnoughAttempts(page: string, eventDescription: string) {
    throw new PerformanceException(HttpStatus.BAD_REQUEST, 'Попытки закончились', page, eventDescription);
  }

  static NotFound(page: string = 'Успеваемость', eventDescription: string = 'Успеваемость не найдена') {
    throw new PerformanceException(HttpStatus.BAD_REQUEST, 'Запись об успеваемости не найдена', page, eventDescription);
  }

  static NotAllowedToIssuanceCertificate(page: string, eventDescription: string) {
    throw new PerformanceException(
      HttpStatus.BAD_REQUEST,
      'По данной успеваемости недопустимо формирование сертификата',
      page,
      eventDescription,
    );
  }

  static CompleteBeforeIssuanceCertificate(page: string, eventDescription: string) {
    throw new PerformanceException(
      HttpStatus.BAD_REQUEST,
      'Необходимо завершить элемент обучения перед формированием сертификата',
      page,
      eventDescription,
    );
  }
}

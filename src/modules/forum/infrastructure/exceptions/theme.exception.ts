import { BaseException, EventLogException } from '@core/exceptions/base.exception';
import { HttpStatus } from '@nestjs/common';

export class ThemeException extends EventLogException {
  static NotFound(page: string = 'Форум', eventDescription: string = 'Тема не найдена') {
    throw new ThemeException(HttpStatus.BAD_REQUEST, 'Тема не найдена', page, eventDescription);
  }

  static Closed(eventDescription: string) {
    throw new ThemeException(HttpStatus.BAD_REQUEST, 'Тема закрыта', 'Форум', eventDescription);
  }
}

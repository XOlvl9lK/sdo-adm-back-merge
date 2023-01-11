import { BaseException, EventLogException } from '@core/exceptions/base.exception';
import { HttpStatus } from '@nestjs/common';

export class MessageException extends EventLogException {
  static NotFound(page: string = 'Сообщения', eventDescription: string = 'Сообщение не найдено') {
    throw new MessageException(HttpStatus.BAD_REQUEST, 'Сообщение не найдено', page, eventDescription);
  }

  static UserNotOwnsMessage(page: string, eventDescription: string) {
    throw new MessageException(HttpStatus.UNAUTHORIZED, 'К этому сообщению нет доступа', page, eventDescription);
  }
}

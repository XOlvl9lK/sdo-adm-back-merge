import { BaseException } from '@core/exceptions/base.exception';
import { HttpStatus } from '@nestjs/common';

export class AttemptException extends BaseException {
  static NotFound() {
    throw new AttemptException(null, HttpStatus.BAD_REQUEST, 'Статистика по попытке не найдена');
  }
}

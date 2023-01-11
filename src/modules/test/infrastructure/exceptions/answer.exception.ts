import { BaseException } from '@core/exceptions/base.exception';
import { HttpStatus } from '@nestjs/common';

export class AnswerException extends BaseException {
  static NotFound() {
    throw new AnswerException(null, HttpStatus.BAD_REQUEST, 'Ответ с таким id не найден');
  }
}

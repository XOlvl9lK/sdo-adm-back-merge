import { BaseException } from '@core/exceptions/base.exception';
import { HttpStatus } from '@nestjs/common';

export class QuestionException extends BaseException {
  static NotFound() {
    throw new QuestionException(null, HttpStatus.BAD_REQUEST, 'Вопрос с таким id не найден');
  }
}

import { BaseException } from '@core/exceptions/base.exception';
import { HttpStatus } from '@nestjs/common';

export class ForumException extends BaseException {
  static NotFound() {
    throw new ForumException(null, HttpStatus.BAD_REQUEST, 'Тема не найдена');
  }
}

import { BaseException } from '@core/exceptions/base.exception';
import { HttpStatus } from '@nestjs/common';

export class HtmlException extends BaseException {
  static NotFound() {
    throw new HtmlException(null, HttpStatus.BAD_REQUEST, 'Такая страница не найдена');
  }
}

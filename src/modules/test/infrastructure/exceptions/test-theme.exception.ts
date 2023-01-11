import { BaseException } from '@core/exceptions/base.exception';
import { HttpStatus } from '@nestjs/common';

export class TestThemeException extends BaseException {
  static NotFound() {
    throw new TestThemeException(null, HttpStatus.BAD_REQUEST, 'Тема теста с таким id не найдена');
  }
}

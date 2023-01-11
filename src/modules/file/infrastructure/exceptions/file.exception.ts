import { BaseException } from '@core/exceptions/base.exception';
import { HttpStatus } from '@nestjs/common';

export class FileException extends BaseException {
  static NotFound() {
    throw new FileException(null, HttpStatus.BAD_REQUEST, 'Файл не найден');
  }
}

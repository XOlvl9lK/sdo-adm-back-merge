import { BaseException } from '@core/exceptions/base.exception';
import { HttpStatus } from '@nestjs/common';

export class PermissionException extends BaseException {
  static AlreadyExists() {
    throw new PermissionException(null, HttpStatus.BAD_REQUEST, 'Такое право уже существует');
  }
}

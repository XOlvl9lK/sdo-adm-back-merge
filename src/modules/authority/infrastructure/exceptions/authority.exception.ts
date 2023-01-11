import { BaseException } from '@core/exceptions/base.exception';
import { HttpStatus } from '@nestjs/common';

export class AuthorityException extends BaseException {
  static NotFound(authority: string) {
    throw new AuthorityException(null, HttpStatus.BAD_REQUEST, `${authority} с таким id не найден(а)`);
  }

  static ImportRestricted() {
    throw new AuthorityException(null, HttpStatus.BAD_REQUEST, `Загрузка данных невозможна, обратитесь к Администратору`);
  }
}

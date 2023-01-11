import { BaseException } from '@core/exceptions/base.exception';
import { HttpStatus } from '@nestjs/common';

export class GroupException extends BaseException {
  static NotFound() {
    throw new GroupException(null, HttpStatus.BAD_REQUEST, 'Группа с таким id не найдена');
  }

  static AlreadyInGroup() {
    throw new GroupException(null, HttpStatus.BAD_REQUEST, 'Пользователь уже находится в группе');
  }
}

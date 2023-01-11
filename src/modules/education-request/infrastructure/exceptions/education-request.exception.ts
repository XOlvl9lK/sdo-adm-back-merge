import { BaseException } from '@core/exceptions/base.exception';
import { HttpStatus } from '@nestjs/common';

export class EducationRequestException extends BaseException {
  static NotFound() {
    throw new EducationRequestException(null, HttpStatus.BAD_REQUEST, 'Заявка не найдена');
  }

  static AlreadyEnrolled() {
    throw new EducationRequestException(null, HttpStatus.BAD_REQUEST, 'Заявка на уже подана');
  }
}

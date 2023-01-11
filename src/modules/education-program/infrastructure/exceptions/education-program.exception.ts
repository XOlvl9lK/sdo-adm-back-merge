import { BaseException } from '@core/exceptions/base.exception';
import { HttpStatus } from '@nestjs/common';

export class EducationProgramException extends BaseException {
  static NotFound() {
    throw new EducationProgramException(null, HttpStatus.BAD_REQUEST, 'Образовательная программа не найдена');
  }
}

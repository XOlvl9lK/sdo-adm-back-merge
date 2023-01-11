import { BaseException } from '@core/exceptions/base.exception';
import { HttpStatus } from '@nestjs/common';

export class TestException extends BaseException {
  static NotFound() {
    throw new TestException(null, HttpStatus.BAD_REQUEST, 'Тест с таким id не найден');
  }

  static NoQuestions() {
    throw new TestException(null, HttpStatus.BAD_REQUEST, 'Тест не содержит вопросов, выполнение невозможно')
  }
}

import { BaseException, EventLogException } from '@core/exceptions/base.exception';
import { HttpStatus } from '@nestjs/common';

export class CourseException extends EventLogException {
  static NotFound(page: string = 'Курсы', eventDescription: string = 'Курс с таким id не найден') {
    throw new CourseException(HttpStatus.BAD_REQUEST, 'Курс с таким id не найден', page, eventDescription);
  }

  static WrongFormat(eventDescription: string) {
    throw new CourseException(HttpStatus.BAD_REQUEST, 'Неверный формат файла', 'Курсы', eventDescription);
  }

  static WrongContent(eventDescription: string) {
    throw new CourseException(HttpStatus.BAD_REQUEST, 'Неверная структура курса', 'Курсы', eventDescription);
  }

  static WrongVersion(eventDescription: string) {
    throw new CourseException(HttpStatus.BAD_REQUEST, 'Неверная версия курса', 'Курсы', eventDescription);
  }
}

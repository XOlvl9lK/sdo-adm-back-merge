import { BaseException, EventLogException } from '@core/exceptions/base.exception';
import { HttpStatus } from '@nestjs/common';

export class EducationElementException extends EventLogException {
  static NotFound(
    page: string = 'Каталог элементов обучения',
    eventDescription: string = 'Образовательный элемент не найден',
  ) {
    throw new EducationElementException(
      HttpStatus.BAD_REQUEST,
      'Образовательный элемент не найден',
      page,
      eventDescription,
    );
  }
  static NotAvailableForAssignment(page: string, eventDescription: string) {
    throw new EducationElementException(
      HttpStatus.BAD_REQUEST,
      'Образовательный элемент не доступен для зачисления',
      page,
      eventDescription,
    );
  }
}

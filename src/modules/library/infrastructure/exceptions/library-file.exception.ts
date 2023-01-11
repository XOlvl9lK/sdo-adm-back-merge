import { EventLogException } from '@core/exceptions/base.exception';
import { HttpStatus } from '@nestjs/common';

export class LibraryFileException extends EventLogException {
  static NotFound(page: string = 'Библиотека', eventDescription: string = 'Файл в библиотеке с таким id не найден') {
    throw new LibraryFileException(
      HttpStatus.BAD_REQUEST,
      'Файл в библиотеке с таким id не найден',
      page,
      eventDescription,
    );
  }

  static QueryParamsError(eventDescription: string, ...params: string[]) {
    throw new LibraryFileException(
      HttpStatus.BAD_REQUEST,
      'Необходимо указать ' + params.join(' и '),
      'Инсталляторы',
      eventDescription,
    );
  }

  static InvalidOs(eventDescription: string) {
    throw new LibraryFileException(
      HttpStatus.BAD_REQUEST,
      'Неверное значение параметра os',
      'Инсталляторы',
      eventDescription,
    );
  }

  static InstallerNotFound(page: string = 'Инсталляторы', eventDescription: string = 'Инталлятор не найден') {
    throw new LibraryFileException(HttpStatus.NOT_FOUND, 'Инталлятор не найден', page, eventDescription);
  }
}

import { EventLogException } from '@core/exceptions/base.exception';
import { HttpStatus } from '@nestjs/common';

export class UserException extends EventLogException {
  static NotFound(page: string, eventDescription: string = 'Пользователь не найден') {
    throw new UserException(HttpStatus.BAD_REQUEST, 'Пользователь не найден', page, eventDescription);
  }

  static AlreadyExists(page: string, eventDescription: string) {
    throw new UserException(
      HttpStatus.BAD_REQUEST,
      'Пользователь с таким логином уже существует',
      page,
      eventDescription,
    );
  }

  static InvalidPassword(page: string, eventDescription: string) {
    throw new UserException(HttpStatus.BAD_REQUEST, 'Неверный пароль', page, eventDescription);
  }

  static SamePassword(page: string, eventDescription: string) {
    throw new UserException(
      HttpStatus.BAD_REQUEST,
      'Новый пароль не должен совпадать со старым',
      page,
      eventDescription,
    );
  }

  static AlreadyLogon(page: string, eventDescription: string) {
    throw new UserException(
      HttpStatus.CONFLICT,
      'Пользователь под этой учётной записью в данный момент авторизован',
      page,
      eventDescription,
    );
  }

  static Unauthorized(page: string, eventDescription: string) {
    throw new UserException(HttpStatus.UNAUTHORIZED, 'Пользователь не авторизован', page, eventDescription);
  }

  static ColumnLengthMismatch(page: string, eventDescription: string) {
    throw new UserException(HttpStatus.BAD_REQUEST, 'Несоответствие числа столбцов', page, eventDescription);
  }

  static ColumnNameMismatch(page: string, eventDescription: string) {
    throw new UserException(HttpStatus.BAD_REQUEST, 'Несоответствие названий столбцов', page, eventDescription);
  }

  static DataRowMissing(page: string, eventDescription: string) {
    throw new UserException(
      HttpStatus.BAD_REQUEST,
      'Отсутствует строка с данными после заголовков',
      page,
      eventDescription,
    );
  }

  static LoginMissing(page: string, eventDescription: string) {
    throw new UserException(
      HttpStatus.BAD_REQUEST,
      'Импорт невозможен. Отсутствует значение Логин ДО и ТП',
      page,
      eventDescription,
    );
  }

  static Forbidden(eventDescription: string) {
    throw new UserException(
      HttpStatus.FORBIDDEN,
      'Недостаточно прав для просмотра раздела',
      'Система аутентификации',
      eventDescription,
    );
  }
}

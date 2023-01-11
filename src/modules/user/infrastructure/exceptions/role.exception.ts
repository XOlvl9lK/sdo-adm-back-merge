import { EventLogException } from '@core/exceptions/base.exception';
import { HttpStatus } from '@nestjs/common';

export class RoleException extends EventLogException {
  static AlreadyExists(page: string, eventDescription: string) {
    throw new RoleException(HttpStatus.BAD_REQUEST, 'Такая роль уже существует', page, eventDescription);
  }

  static NotFound(page: string, eventDescription: string = 'Роль с таким id не найдена') {
    throw new RoleException(HttpStatus.BAD_REQUEST, 'Роль с таким id не найдена', page, eventDescription);
  }

  static RolesHasUsers(page: string, eventDescription: string) {
    throw new RoleException(
      HttpStatus.BAD_REQUEST,
      'Невозможно удалить роли, так как в них содержатся пользователи',
      page,
      eventDescription,
    );
  }

  static HasChildRoles(page: string, eventDescription: string) {
    throw new RoleException(
      HttpStatus.BAD_REQUEST,
      'Невозможно удалить роли, так как на их основе созданы другие роли',
      page,
      eventDescription,
    );
  }

  static NotRemovableRoles(page: string, eventDescription: string) {
    throw new RoleException(
      HttpStatus.BAD_REQUEST,
      'Невозможно удалить роли, так как они являются системными',
      page,
      eventDescription,
    );
  }
}

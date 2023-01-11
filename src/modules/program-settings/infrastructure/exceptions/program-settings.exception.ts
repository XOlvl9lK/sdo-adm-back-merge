import { BaseException } from '@core/exceptions/base.exception';
import { HttpStatus } from '@nestjs/common';

export class ProgramSettingsException extends BaseException {
  static NotFound() {
    throw new ProgramSettingsException(null, HttpStatus.BAD_REQUEST, 'Настройка с таким id не найдена');
  }

  static AlreadyHasSettings() {
    throw new ProgramSettingsException(null, HttpStatus.BAD_REQUEST, 'Для данной роли ДИБ уже есть настройка')
  }
}

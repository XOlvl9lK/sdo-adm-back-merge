import { BaseException } from '@core/exceptions/base.exception';
import { HttpStatus } from '@nestjs/common';

export class SettingsException extends BaseException {
  static NotFound() {
    throw new SettingsException(null, HttpStatus.BAD_REQUEST, 'Настройки не найдены');
  }
}

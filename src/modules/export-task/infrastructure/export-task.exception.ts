import { BaseException } from '@core/exceptions/base.exception';
import { HttpStatus } from '@nestjs/common';

export class ExportTaskException extends BaseException {
  static HasInProcessWorker() {
    throw new ExportTaskException(
      null,
      HttpStatus.BAD_REQUEST,
      'Система загружена, повторите попытку позже'
    )
  }
}
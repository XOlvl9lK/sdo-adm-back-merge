import { BaseException, EventLogException } from '@core/exceptions/base.exception';
import { HttpStatus } from '@nestjs/common';

export class ChapterException extends EventLogException {
  static NotFound() {
    throw new ChapterException(
      HttpStatus.BAD_REQUEST,
      'Раздел с таким id не найден',
      'Разделы обучения',
      'Раздел с таким id не найден',
    );
  }

  static AlreadyExists(errorDescription: string) {
    throw new ChapterException(
      HttpStatus.BAD_REQUEST,
      'Раздел с таким названием уже существует',
      'Разделы обучения',
      errorDescription,
    );
  }
}

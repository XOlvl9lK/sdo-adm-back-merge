import { HttpException, HttpStatus } from '@nestjs/common';

export class BaseException extends HttpException {
  constructor(
    public object: Error | null,
    status: HttpStatus | number,
    message: string = `An error occurred, for more information, see 'error'.`,
  ) {
    super(message, status);
  }

  static InternalError(e: Error) {
    throw new BaseException(e, HttpStatus.INTERNAL_SERVER_ERROR, 'Internal server error');
  }

  static BadRequest(e: Error, message: string = 'Bad Request') {
    throw new BaseException(e, HttpStatus.BAD_REQUEST, message);
  }
}

export class EventLogException extends BaseException {
  constructor(status: HttpStatus | number, message: string, public page: string, public eventDescription: string) {
    super(null, status, message);
  }
}

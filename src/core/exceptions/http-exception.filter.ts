import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventLogException } from '@core/exceptions/base.exception';
import { EventActionEnum } from '@modules/event/application/create-event.service';
import { ErrorEvent } from '@modules/event/infrastructure/events/error.event';
import { LoggerService } from '@core/logger/logger.service';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private eventEmitter: EventEmitter2) {}

  catch(exception: any, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const status = exception?.status || 500;

    if (exception instanceof EventLogException) {
      this.eventEmitter.emit(EventActionEnum.ERROR, new ErrorEvent(exception.page, exception.eventDescription));
    } else if (status === 500) {
      this.eventEmitter.emit(
        EventActionEnum.ERROR,
        new ErrorEvent('Внутренние системы', 'Внутренняя ошибка сервера', { message: exception?.message, stack: exception?.stack }),
      );
    }

    LoggerService.error(exception?.message, exception?.stack, 'INTERNAL ERROR')

    res.status(status).json({
      statusCode: status,
      message: exception?.message,
      exception: exception,
    });
  }
}

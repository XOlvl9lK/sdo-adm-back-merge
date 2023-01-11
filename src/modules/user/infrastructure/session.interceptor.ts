import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { RequestWithCredentials } from '@core/libs/types';
import { Reflector } from '@nestjs/core';
import { tap } from 'rxjs/operators';
import { SessionEvent } from '@modules/user/infrastructure/session.event';

@Injectable()
export class SessionInterceptor implements NestInterceptor {
  constructor(private eventEmitter: EventEmitter2, private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> | Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest<RequestWithCredentials>();
    const page = this.reflector.get<string | undefined>('page', context.getHandler());

    return next.handle().pipe(
      tap(async () => {
        if (req?.user?.userId && page) {
          await this.eventEmitter.emitAsync(
            'session',
            new SessionEvent(req.user.userId, page, req.header('x-forwarded-for') || req.ip),
          );
        }
      }),
    );
  }
}

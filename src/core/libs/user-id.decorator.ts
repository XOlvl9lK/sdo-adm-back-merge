import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const UserId = createParamDecorator((data: unknown, context: ExecutionContext) => {
  const req = context.switchToHttp().getRequest<Request>();
  //@ts-ignore
  return req?.user?.userId;
});

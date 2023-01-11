import { LoggerService } from '@core/logger/logger.service';
import { HttpException, HttpStatus } from '@nestjs/common';

type TryCatchDecoratorProps = {
  context?: string;
  async?: boolean;
};

export function TryCatch(props?: TryCatchDecoratorProps) {
  return function (target: any, propertyName: string, descriptor: TypedPropertyDescriptor<any>) {
    let method = descriptor.value!;

    if (props.async) {
      descriptor.value = async function wrapper() {
        try {
          return await method.apply(this, arguments);
        } catch (e: any) {
          LoggerService.error(e?.message, e?.stack, props?.context);
          throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR)
        }
      };
    } else {
      descriptor.value = function wrapper() {
        try {
          return method.apply(this, arguments);
        } catch (e: any) {
          LoggerService.error(e?.message, e?.stack, props?.context);
          throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR)
        }
      };
    }

    return descriptor;
  };
}

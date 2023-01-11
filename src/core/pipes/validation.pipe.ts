import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { BaseException } from 'src/core/exceptions/base.exception';
import { plainToInstance } from 'class-transformer';
import { LoggerService } from 'src/core/logger/logger.service';
import { validate } from 'class-validator';
import { ValidationPipe as NestValidationPipe } from '@nestjs/common';

@Injectable()
export class ValidationPipe extends NestValidationPipe implements PipeTransform<any> {
  async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    const obj = plainToInstance(metadata.metatype, value);
    if (obj) {
      const errors = await validate(obj);

      if (errors.length) {
        const message = errors
          .map(e => {
            return `${e.property} - ${Object.values(e.constraints).join(', ')}`;
          })
          .join('. ');
        LoggerService.warn(message, 'Validation');
        BaseException.BadRequest(null, message);
      }
    }
    return value;
  }
}

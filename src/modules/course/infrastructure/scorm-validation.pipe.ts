import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { CourseException } from '@modules/course/infrastructure/exceptions/course.exception';

const availableMimeTypes = ['application/zip', 'application/x-zip-compressed', 'multipart/x-zip'];

@Injectable()
export class ScormValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata): any {
    if (!availableMimeTypes.includes(value?.mimetype))
      CourseException.WrongFormat('Попытка загрузки курса неверного формата');
    return value;
  }
}

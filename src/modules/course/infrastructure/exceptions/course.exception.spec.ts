import { CourseException } from '@modules/course/infrastructure/exceptions/course.exception';

describe('CourseException', () => {
  test('Should throw', () => {
    expect(() => {
      CourseException.NotFound();
    }).toThrow('Курс с таким id не найден');
  });
});

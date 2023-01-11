import { EducationRequestException } from '@modules/education-request/infrastructure/exceptions/education-request.exception';

describe('EducationRequestException', () => {
  test('Should throw', () => {
    expect(() => {
      EducationRequestException.NotFound();
    }).toThrow('Заявка не найдена');
  });

  test('Should throw', () => {
    expect(() => {
      EducationRequestException.AlreadyEnrolled();
    }).toThrow('Заявка на уже подана');
  });
});

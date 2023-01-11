import { EducationProgramException } from '@modules/education-program/infrastructure/exceptions/education-program.exception';

describe('EducationProgramException', () => {
  test('Should throw', () => {
    expect(() => {
      EducationProgramException.NotFound();
    }).toThrow('Образовательная программа не найдена');
  });
});

import { EducationElementException } from '@modules/education-program/infrastructure/exceptions/education-element.exception';

describe('EducationElementException', () => {
  test('Should throw', () => {
    expect(() => {
      EducationElementException.NotFound();
    }).toThrow('Образовательный элемент не найден');
  });
});

import { ChapterException } from '@modules/chapter/infrastructure/exceptions/chapter.exception';

describe('ChapterException', () => {
  test('Should throw', () => {
    expect(() => {
      ChapterException.NotFound();
    }).toThrow('Раздел с таким id не найден');
  });

  test('Should throw', () => {
    expect(() => {
      ChapterException.AlreadyExists();
    }).toThrow('Раздел с таким названием уже существует');
  });
});

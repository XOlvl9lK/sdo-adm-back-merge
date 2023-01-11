import { LibraryFileException } from '@modules/library/infrastructure/exceptions/library-file.exception';

describe('LibraryFileException', () => {
  test('Should throw', () => {
    expect(() => {
      LibraryFileException.NotFound();
    }).toThrow('Файл в библиотеке с таким id не найден');
  });

  test('Should throw', () => {
    expect(() => {
      LibraryFileException.QueryParamsError('параметр');
    }).toThrow('Необходимо указать параметр');
  });

  test('Should throw', () => {
    expect(() => {
      LibraryFileException.InvalidOs();
    }).toThrow('Неверное значение параметра os');
  });

  test('Should throw', () => {
    expect(() => {
      LibraryFileException.InstallerNotFound();
    }).toThrow('Инталлятор не найден');
  });
});

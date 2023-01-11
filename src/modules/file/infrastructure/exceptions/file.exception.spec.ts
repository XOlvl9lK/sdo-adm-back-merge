import { FileException } from '@modules/file/infrastructure/exceptions/file.exception';

describe('FileException', () => {
  test('Should throw', () => {
    expect(() => {
      FileException.NotFound();
    }).toThrow('Файл не найден');
  });
});

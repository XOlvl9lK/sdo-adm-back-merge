import { TestThemeException } from '@modules/test/infrastructure/exceptions/test-theme.exception';

describe('TestThemeException', () => {
  test('Should throw', () => {
    expect(() => {
      TestThemeException.NotFound();
    }).toThrow('Тема теста с таким id не найдена');
  });
});

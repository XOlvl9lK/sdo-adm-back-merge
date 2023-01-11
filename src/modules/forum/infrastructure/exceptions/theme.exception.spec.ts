import { ThemeException } from '@modules/forum/infrastructure/exceptions/theme.exception';

describe('ThemeException', () => {
  test('Should throw', () => {
    expect(() => {
      ThemeException.NotFound();
    }).toThrow('Тема не найдена');
  });

  test('Should throw', () => {
    expect(() => {
      ThemeException.Closed();
    }).toThrow('Тема закрыта');
  });
});

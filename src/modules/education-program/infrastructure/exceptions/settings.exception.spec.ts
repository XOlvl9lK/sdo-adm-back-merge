import { SettingsException } from '@modules/education-program/infrastructure/exceptions/settings.exception';

describe('SettingsException', () => {
  test('Should throw', () => {
    expect(() => {
      SettingsException.NotFound();
    }).toThrow('Настройки не найдены');
  });
});

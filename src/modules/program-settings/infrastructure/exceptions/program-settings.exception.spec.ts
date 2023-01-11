import { ProgramSettingsException } from '@modules/program-settings/infrastructure/exceptions/program-settings.exception';

describe('ProgramSettingsException', () => {
  test('Should throw', () => {
    expect(() => {
      ProgramSettingsException.NotFound();
    }).toThrow('Настройка с таким id не найдена');
  });
});

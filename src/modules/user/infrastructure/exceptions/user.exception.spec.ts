import { UserException } from '@modules/user/infrastructure/exceptions/user.exception';

describe('UserException', () => {
  test('Should throw', () => {
    expect(() => {
      // UserException.NotFound();
    }).toThrow('Пользователь не найден');
  });

  test('Should throw', () => {
    expect(() => {
      // UserException.AlreadyExists();
    }).toThrow('Пользователь с таким логином уже существует');
  });

  test('Should throw', () => {
    expect(() => {
      // UserException.InvalidPassword();
    }).toThrow('Неверный пароль');
  });

  test('Should throw', () => {
    expect(() => {
      // UserException.SamePassword();
    }).toThrow('Новый пароль не должен совпадать со старым');
  });

  test('Should throw', () => {
    expect(() => {
      // UserException.AlreadyLogon();
    }).toThrow('Пользователь под этой учётной записью в данный момент авторизован');
  });

  test('Should throw', () => {
    expect(() => {
      // UserException.Unauthorized();
    }).toThrow('Пользователь не авторизован');
  });

  test('Should throw', () => {
    expect(() => {
      // UserException.ColumnLengthMismatch();
    }).toThrow('Несоответствие числа столбцов');
  });

  test('Should throw', () => {
    expect(() => {
      // UserException.ColumnNameMismatch();
    }).toThrow('Несоответствие названий столбцов');
  });

  test('Should throw', () => {
    expect(() => {
      // UserException.DataRowMissing();
    }).toThrow('Отсутствует строка с данными после заголовков');
  });

  test('Should throw', () => {
    expect(() => {
      // UserException.LoginMissing();
    }).toThrow('Импорт невозможен. Отсутствует значение Логин ДО и ТП');
  });
});

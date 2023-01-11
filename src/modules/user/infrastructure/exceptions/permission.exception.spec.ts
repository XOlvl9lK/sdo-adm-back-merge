import { PermissionException } from '@modules/user/infrastructure/exceptions/permission.exception';

describe('PermissionException', () => {
  test('Should throw', () => {
    expect(() => {
      PermissionException.AlreadyExists();
    }).toThrow('Такое право уже существует');
  });
});

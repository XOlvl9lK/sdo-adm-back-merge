import { RoleException } from '@modules/user/infrastructure/exceptions/role.exception';

describe('RoleException', () => {
  test('Should throw', () => {
    expect(() => {
      RoleException.AlreadyExists();
    }).toThrow('Такая роль уже существует');
  });

  test('Should throw', () => {
    expect(() => {
      RoleException.NotFound();
    }).toThrow('Роль с таким id не найдена');
  });

  test('Should throw', () => {
    expect(() => {
      RoleException.HasUsers();
    }).toThrow('Невозможно удалить роли, так как в них содержатся пользователи');
  });
});

import { AuthorityException } from '@modules/authority/infrastructure/exceptions/authority.exception';

describe('AuthorityException', () => {
  test('Should throw', () => {
    expect(() => {
      AuthorityException.NotFound('Регион');
    }).toThrow(`Регион с таким id не найден(а)`);
  });
});

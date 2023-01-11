import { GroupException } from '@modules/group/infrastructure/exceptions/group.exception';

describe('GroupException', () => {
  test('Should throw', () => {
    expect(() => {
      GroupException.NotFound();
    }).toThrow('Группа с таким id не найдена');
  });

  test('Should throw', () => {
    expect(() => {
      GroupException.AlreadyInGroup();
    }).toThrow('Пользователь уже находится в группе');
  });
});

import { Random } from '@core/test/random';
import { mockUserInstance } from '@modules/user/domain/user.entity.spec';
import { add, sub } from 'date-fns';
import { plainToInstance } from 'class-transformer';
import { SessionEntity } from '@modules/user/domain/session.entity';

const mockSession = {
  refresh_token: Random.id,
  user: mockUserInstance,
  expirationDate: add(new Date(), { hours: 2 }),
  ip: Random.ip,
  isConnected: false,
};

export const mockSessionInstance = plainToInstance(SessionEntity, mockSession);

describe('SessionEntity', () => {
  test('Should return true on valid session', () => {
    const result = mockSessionInstance.isValid();

    expect(result).toBe(true);
  });

  test('Should return false on invalid session', () => {
    const invalidSession = {
      ...mockSession,
      expirationDate: sub(new Date(), { hours: 1 }),
    };
    const invalidSessionInstance = plainToInstance(SessionEntity, invalidSession);

    const result = invalidSessionInstance.isValid();

    expect(result).toBe(false);
  });

  test('Should update ip and last page', () => {
    mockSessionInstance.update('128.0.0.1', 'Page');

    expect(mockSessionInstance.ip).toBe('128.0.0.1');
    expect(mockSessionInstance.lastPage).toBe('Page');
  });

  test('Should connect session', () => {
    mockSessionInstance.connect();

    expect(mockSessionInstance.isConnected).toBe(true);
  });

  test('Should disconnect session', () => {
    mockSessionInstance.disconnect();

    expect(mockSessionInstance.isConnected).toBe(false);
  });

  test('Should prolong session', () => {
    const realDate = Date;
    const constantDate = new Date();
    //@ts-ignore
    global.Date = class extends Date {
      constructor() {
        super();
        return constantDate;
      }
    };

    mockSessionInstance.prolong();

    expect(mockSessionInstance.expirationDate).toEqual(add(constantDate, { hours: 2 }));

    global.Date = realDate;
  });
});

import {
  educationProgramPerformanceRepositoryMockProvider,
  TestHelper,
  userRepositoryMockProvider,
} from '@core/test/test.helper';
import { RegisteredUsersService } from '@modules/control/application/registered-users.service';
import { Random } from '@core/test/random';
import { mockUserInstance } from '@modules/user/domain/user.entity.spec';
import { Buffer } from 'buffer';
import { ExcelHelper } from '@modules/control/infrastructure/excel.helper';
import { format } from 'date-fns';

const helpers = new TestHelper(userRepositoryMockProvider, educationProgramPerformanceRepositoryMockProvider);

describe('RegisteredUsersService', () => {
  let registeredUsersService: RegisteredUsersService;

  beforeAll(async () => {
    [registeredUsersService] = await helpers.beforeAll([RegisteredUsersService]);
  });

  test('Should return registered users and count', async () => {
    const result = await registeredUsersService.getRegisteredUsers(
      {
        dateStart: Random.dateFuture.toISOString(),
        dateEnd: Random.dateFuture.toISOString(),
      },
      {},
    );

    expect(result).toEqual({
      total: Random.number,
      data: [mockUserInstance],
    });
  });

  test('Size should be greater than 0', async () => {
    await registeredUsersService.exportXlsx(
      {
        dateStart: Random.dateFuture.toISOString(),
        dateEnd: Random.dateFuture.toISOString(),
      },
      helpers.response,
    );

    const buffer = helpers.response._getBuffer();

    expect(Buffer.byteLength(buffer)).toBeGreaterThan(0);
  });

  test('Size should be greater than 0', async () => {
    await registeredUsersService.exportXls(
      {
        dateStart: Random.dateFuture.toISOString(),
        dateEnd: Random.dateFuture.toISOString(),
      },
      helpers.response,
    );

    const buffer = helpers.response._getBuffer();

    expect(Buffer.byteLength(buffer)).toBeGreaterThan(0);
  });

  test('Size should be greater than 0', async () => {
    await registeredUsersService.exportOds(
      {
        dateStart: Random.dateFuture.toISOString(),
        dateEnd: Random.dateFuture.toISOString(),
      },
      helpers.response,
    );

    const buffer = helpers.response._getBuffer();

    expect(Buffer.byteLength(buffer)).toBeGreaterThan(0);
  });
});

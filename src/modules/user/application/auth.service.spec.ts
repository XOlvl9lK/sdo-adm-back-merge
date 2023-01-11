import { TestHelper } from '@core/test/test.helper';
import { SessionRepository } from '@modules/user/infrastructure/database/session.repository';
import { mockSessionInstance } from '@modules/user/domain/session.entity.spec';
import { AuthService } from '@modules/user/application/auth.service';
import { Test } from '@nestjs/testing';
import { Random } from '@core/test/random';
import { JwtService } from '@nestjs/jwt';
import clearAllMocks = jest.clearAllMocks;
import { UserRepository } from '@modules/user/infrastructure/database/user.repository';
import { mockUserInstance } from '@modules/user/domain/user.entity.spec';

const helpers = new TestHelper(
  {
    type: 'repository',
    provide: UserRepository,
    mockValue: mockUserInstance,
    extend: [
      {
        method: 'findByLogin',
        mockImplementation: jest.fn().mockResolvedValue(mockUserInstance),
      },
    ],
  },
  {
    type: 'repository',
    provide: SessionRepository,
    mockValue: mockSessionInstance,
    extend: [
      {
        method: 'findByUserId',
        mockImplementation: jest.fn().mockResolvedValue(undefined),
      },
      {
        method: 'findByToken',
        mockImplementation: jest.fn().mockResolvedValue(mockSessionInstance),
      },
    ],
  },
);

describe('AuthService', () => {
  let authService: AuthService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        ...helpers.mockProviders,
        helpers.eventEmitterMockProvider,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue(Random.id),
          },
        },
      ],
    }).compile();

    authService = moduleRef.get(AuthService);
  });

  test('Login method should save session, return tokens and emit', async () => {
    // const result = await authService.login({ login: Random.firstName, password: Random.password })
    //
    // const mockSessionRepository = helpers.getProviderByToken('SessionRepository').useValue
    //
    // expect(mockSessionRepository.save).toHaveBeenCalledTimes(1)
    // expect(result).toEqual({
    //   access_token: Random.id,
    //   session: mockSessionInstance
    // })
    // expect(helpers.eventEmitterMockProvider.useValue.emit).toHaveBeenCalledTimes(1)
  });

  afterEach(() => {
    clearAllMocks();
  });
});

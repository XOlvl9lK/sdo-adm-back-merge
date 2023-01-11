import { AuthController } from '@modules/user/controllers/auth.controller';
import { Test } from '@nestjs/testing';
import { AuthService } from '@modules/user/application/auth.service';
import { Random } from '@core/test/random';
import { mockSessionInstance } from '@modules/user/domain/session.entity.spec';
import { TestHelper } from '@core/test/test.helper';
import clearAllMocks = jest.clearAllMocks;

const helpers = new TestHelper();

const mockAuthService = {
  login: jest.fn().mockResolvedValue({
    access_token: Random.lorem,
    session: mockSessionInstance,
  }),
  logout: jest.fn(),
  refresh: jest.fn().mockResolvedValue({
    access_token: Random.lorem,
    session: mockSessionInstance,
  }),
};

describe('AuthController', () => {
  let authController: AuthController;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authController = moduleRef.get(AuthController);
  });

  test('Should login', async () => {
    const cookieSpy = jest.spyOn(helpers.response, 'cookie');
    const jsonSpy = jest.spyOn(helpers.response, 'json');
    await authController.login({ login: Random.lorem, password: Random.password }, helpers.response);

    expect(mockAuthService.login).toHaveBeenCalledTimes(1);
    expect(mockAuthService.login).toHaveBeenCalledWith({
      login: Random.lorem,
      password: Random.password,
    });
    expect(cookieSpy).toHaveBeenCalledWith('refresh_token', mockSessionInstance.refresh_token, { httpOnly: true });
    expect(jsonSpy).toHaveBeenCalledWith({ access_token: Random.lorem });
  });

  test('Should force login', async () => {
    const cookieSpy = jest.spyOn(helpers.response, 'cookie');
    const jsonSpy = jest.spyOn(helpers.response, 'json');
    await authController.forceLogin({ login: Random.lorem, password: Random.password }, helpers.response);

    expect(mockAuthService.login).toHaveBeenCalledTimes(1);
    expect(mockAuthService.login).toHaveBeenCalledWith({ login: Random.lorem, password: Random.password }, true);
    expect(cookieSpy).toHaveBeenCalledWith('refresh_token', mockSessionInstance.refresh_token, { httpOnly: true });
    expect(jsonSpy).toHaveBeenCalledWith({ access_token: Random.lorem });
  });

  test('Should logout', async () => {
    await authController.logout(Random.id);

    expect(mockAuthService.logout).toHaveBeenCalledTimes(1);
    expect(mockAuthService.logout).toHaveBeenCalledWith(Random.id);
  });

  test('Should refresh token', async () => {
    const cookieSpy = jest.spyOn(helpers.response, 'cookie');
    const jsonSpy = jest.spyOn(helpers.response, 'json');
    await authController.refresh({ cookies: { refresh_token: Random.lorem } } as any, helpers.response);

    expect(mockAuthService.refresh).toHaveBeenCalledTimes(1);
    expect(mockAuthService.refresh).toHaveBeenCalledWith(Random.lorem);
    expect(cookieSpy).toHaveBeenCalledWith('refresh_token', mockSessionInstance.refresh_token, { httpOnly: true });
    expect(jsonSpy).toHaveBeenCalledWith({ access_token: Random.lorem });
  });

  test('Should clear cookie if refresh token expired', async () => {
    jest.spyOn(mockAuthService, 'refresh').mockRejectedValue(new Error());
    const clearCookieSpy = jest.spyOn(helpers.response, 'clearCookie');
    const statusSpy = jest.spyOn(helpers.response, 'status');
    await authController.refresh({ cookies: { refresh_token: Random.lorem } } as any, helpers.response);

    expect(mockAuthService.refresh).toHaveBeenCalledTimes(1);
    expect(mockAuthService.refresh).toHaveBeenCalledWith(Random.lorem);

    expect(clearCookieSpy).toHaveBeenCalledWith('refresh_token');
    expect(statusSpy).toHaveBeenCalledWith(401);
  });

  afterEach(() => {
    clearAllMocks();
  });
});

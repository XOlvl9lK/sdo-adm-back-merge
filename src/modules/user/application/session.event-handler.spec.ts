import { sessionMockProvider, TestHelper } from '@core/test/test.helper';
import { SessionEventHandler } from '@modules/user/application/session.event-handler';
import { Test } from '@nestjs/testing';
import { mockSessionInstance } from '@modules/user/domain/session.entity.spec';
import { Random } from '@core/test/random';
import { SessionRepository } from '@modules/user/infrastructure/database/session.repository';
const helpers = new TestHelper(sessionMockProvider);

describe(SessionEventHandler, () => {
  let sessionEventHandler: SessionEventHandler;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [SessionEventHandler, ...helpers.mockProviders],
    }).compile();

    sessionEventHandler = moduleRef.get(SessionEventHandler);
  });

  test('Should update session and save in database', async () => {
    await sessionEventHandler.handleSessionEvent({
      ip: '128.0.0.1',
      page: 'Page',
      userId: Random.id,
    });

    const mockSessionRepository = helpers.getProviderValueByToken('SessionRepository');

    mockSessionInstance.ip = '128.0.0.1';
    mockSessionInstance.lastPage = 'Page';
    expect(mockSessionRepository.save).toHaveBeenCalledTimes(1);
    expect(mockSessionRepository.save).toHaveBeenCalledWith(mockSessionInstance);
  });
});

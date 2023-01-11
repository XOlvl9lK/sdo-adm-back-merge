import { forumRepositoryMockProvider, TestHelper, themeRepositoryMockProvider } from '@core/test/test.helper';
import { UpdateThemeService } from '@modules/forum/application/update-theme.service';
import { Random } from '@core/test/random';
import { EventActionEnum } from '@modules/event/application/create-event.service';
import { UpdateEntityEvent } from '@modules/event/infrastructure/events/update-entity.event';
import { mockThemeInstance } from '@modules/forum/domain/theme.entity.spec';
import { ThemeActionEnum, UpdateForumThemeEvent } from '@modules/event/infrastructure/events/update-forum-theme.event';
import clearAllMocks = jest.clearAllMocks;

const helpers = new TestHelper(themeRepositoryMockProvider, forumRepositoryMockProvider);

describe('UpdateThemeService', () => {
  let updateThemeService: UpdateThemeService;

  beforeAll(async () => {
    [updateThemeService] = await helpers.beforeAll([UpdateThemeService]);
  });

  test('Should update theme and emit', async () => {
    await updateThemeService.update(
      {
        id: Random.id,
        title: Random.lorem,
        description: Random.lorem,
        forumId: Random.id,
        leaveLink: false,
      },
      Random.id,
    );

    const mockEventEmitter = helpers.getProviderValueByToken('EventEmitter2');
    const mockThemeRepository = helpers.getProviderValueByToken('ThemeRepository');

    expect(mockEventEmitter.emit).toHaveBeenCalledTimes(1);
    expect(mockEventEmitter.emit).toHaveBeenCalledWith(
      EventActionEnum.UPDATE_ENTITY,
      new UpdateEntityEvent('тему форума', Random.id, 'Форум', mockThemeInstance),
    );
    expect(mockThemeRepository.save).toHaveBeenCalledTimes(1);
    expect(mockThemeRepository.save).toHaveBeenCalledWith(mockThemeInstance);
  });

  test('Should close theme and emit', async () => {
    await updateThemeService.close(Random.id, Random.id);

    const mockEventEmitter = helpers.getProviderValueByToken('EventEmitter2');
    const mockThemeRepository = helpers.getProviderValueByToken('ThemeRepository');

    expect(mockEventEmitter.emit).toHaveBeenCalledTimes(1);
    expect(mockEventEmitter.emit).toHaveBeenCalledWith(
      EventActionEnum.UPDATE_FORUM_THEME,
      new UpdateForumThemeEvent(Random.id, ThemeActionEnum.CLOSE, Random.id),
    );
    expect(mockThemeRepository.save).toHaveBeenCalledTimes(1);
    expect(mockThemeRepository.save).toHaveBeenCalledWith(mockThemeInstance);
  });

  test('Should fix theme and emit', async () => {
    await updateThemeService.fix(Random.id, Random.id);

    const mockEventEmitter = helpers.getProviderValueByToken('EventEmitter2');
    const mockThemeRepository = helpers.getProviderValueByToken('ThemeRepository');

    expect(mockEventEmitter.emit).toHaveBeenCalledTimes(1);
    expect(mockEventEmitter.emit).toHaveBeenCalledWith(
      EventActionEnum.UPDATE_FORUM_THEME,
      new UpdateForumThemeEvent(Random.id, ThemeActionEnum.FIX, Random.id),
    );
    expect(mockThemeRepository.save).toHaveBeenCalledTimes(1);
    expect(mockThemeRepository.save).toHaveBeenCalledWith(mockThemeInstance);
  });

  test('Should open theme and emit', async () => {
    await updateThemeService.open(Random.id, Random.id);

    const mockEventEmitter = helpers.getProviderValueByToken('EventEmitter2');
    const mockThemeRepository = helpers.getProviderValueByToken('ThemeRepository');

    expect(mockEventEmitter.emit).toHaveBeenCalledTimes(1);
    expect(mockEventEmitter.emit).toHaveBeenCalledWith(
      EventActionEnum.UPDATE_FORUM_THEME,
      new UpdateForumThemeEvent(Random.id, ThemeActionEnum.OPEN, Random.id),
    );
    expect(mockThemeRepository.save).toHaveBeenCalledTimes(1);
    expect(mockThemeRepository.save).toHaveBeenCalledWith(mockThemeInstance);
  });

  test('Should unpin theme and emit', async () => {
    await updateThemeService.unpin(Random.id, Random.id);

    const mockEventEmitter = helpers.getProviderValueByToken('EventEmitter2');
    const mockThemeRepository = helpers.getProviderValueByToken('ThemeRepository');

    expect(mockEventEmitter.emit).toHaveBeenCalledTimes(1);
    expect(mockEventEmitter.emit).toHaveBeenCalledWith(
      EventActionEnum.UPDATE_FORUM_THEME,
      new UpdateForumThemeEvent(Random.id, ThemeActionEnum.UNPIN, Random.id),
    );
    expect(mockThemeRepository.save).toHaveBeenCalledTimes(1);
    expect(mockThemeRepository.save).toHaveBeenCalledWith(mockThemeInstance);
  });

  afterEach(() => {
    clearAllMocks();
  });
});

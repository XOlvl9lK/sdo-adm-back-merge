import {
  forumRepositoryMockProvider,
  TestHelper,
  themeRepositoryMockProvider,
  userRepositoryMockProvider,
} from '@core/test/test.helper';
import { CreateThemeService } from '@modules/forum/application/create-theme.service';
import { Random } from '@core/test/random';
import { EventActionEnum } from '@modules/event/application/create-event.service';
import { ThemeCreatedEvent } from '@modules/event/infrastructure/events/theme-created.event';
import { CreateEntityEvent } from '@modules/event/infrastructure/events/create-entity.event';
import { ThemeEntity } from '@modules/forum/domain/theme.entity';
import { mockThemeInstance } from '@modules/forum/domain/theme.entity.spec';
jest.mock('@modules/forum/domain/theme.entity');
//@ts-ignore
ThemeEntity.mockImplementation(() => mockThemeInstance);

const helpers = new TestHelper(themeRepositoryMockProvider, forumRepositoryMockProvider, userRepositoryMockProvider);

describe('CreateThemeService', () => {
  let createThemeService: CreateThemeService;

  beforeAll(async () => {
    [createThemeService] = await helpers.beforeAll([CreateThemeService]);
  });

  test('Should create theme and emit twice', async () => {
    await createThemeService.create(
      {
        title: Random.lorem,
        description: Random.lorem,
        forumId: Random.id,
        authorId: Random.id,
      },
      Random.id,
    );

    const mockThemeRepository = helpers.getProviderValueByToken('ThemeRepository');
    const mockEventEmitter = helpers.getProviderValueByToken('EventEmitter2');

    expect(mockEventEmitter.emit).toHaveBeenCalledTimes(2);
    expect(mockEventEmitter.emit).toHaveBeenCalledWith(
      EventActionEnum.THEME_CREATED,
      new ThemeCreatedEvent(Random.id, Random.id),
    );
    expect(mockEventEmitter.emit).toHaveBeenCalledWith(
      EventActionEnum.CREATE_ENTITY,
      new CreateEntityEvent('тему форума', Random.id, Random.id, 'Форум'),
    );
    expect(mockThemeRepository.save).toHaveBeenCalledTimes(1);
    expect(mockThemeRepository.save).toHaveBeenCalledWith(mockThemeInstance);
  });
});

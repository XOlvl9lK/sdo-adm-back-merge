import { TestHelper } from '@core/test/test.helper';
import { EventRepository } from '@modules/event/infrastructure/database/event.repository';
import { mockEventInstance } from '@modules/event/domain/event.entity.mock';
import { CreateEventService } from '@modules/event/application/create-event.service';
import { Random } from '@core/test/random';
import { EventEntity, EventTypeEnum } from '@modules/event/domain/event.entity';
import { AuthActionEnum, AuthEvent } from '@modules/event/infrastructure/events/auth.event';
import { CreateEntityEvent } from '@modules/event/infrastructure/events/create-entity.event';
import { EducationRequestEvent } from '@modules/event/infrastructure/events/education-request.event';
import { EducationRequestAcceptEvent } from '@modules/event/infrastructure/events/education-request-accept.event';
import { EducationElementTypeEnum } from '@modules/education-program/domain/education-element.entity';
import { AddLibraryFileEvent } from '@modules/event/infrastructure/events/add-library-file.event';
import { SendMessageEvent } from '@modules/event/infrastructure/events/send-message.event';
import { UpdateEntityEvent } from '@modules/event/infrastructure/events/update-entity.event';
import { ThemeActionEnum, UpdateForumThemeEvent } from '@modules/event/infrastructure/events/update-forum-theme.event';
import clearAllMocks = jest.clearAllMocks;
import { TruncateEventEvent } from '@modules/event/infrastructure/events/truncate-event.event';
import { StartTrainingEvent } from '@modules/event/infrastructure/events/start-training.event';
import { ChangeOrderEvent } from '@modules/event/infrastructure/events/change-order.event';

jest.mock('@modules/event/domain/event.entity');
//@ts-ignore
EventEntity.mockImplementation(() => mockEventInstance);

const helpers = new TestHelper({
  type: 'repository',
  provide: EventRepository,
  mockValue: mockEventInstance,
});

describe('CreateEventService', () => {
  let createEventService: CreateEventService;

  beforeAll(async () => {
    [createEventService] = await helpers.beforeAll([CreateEventService]);
  });

  test('Should create event', async () => {
    await createEventService['create']({
      page: Random.lorem,
      description: Random.lorem,
      type: EventTypeEnum.INFO,
    });

    const mockEventRepository = helpers.getProviderValueByToken('EventRepository');

    expect(mockEventRepository.save).toHaveBeenCalledTimes(1);
    expect(mockEventRepository.save).toHaveBeenCalledWith(mockEventInstance);
  });

  test('Should handle authEvent', async () => {
    //@ts-ignore
    const createSpy = jest.spyOn(createEventService, 'create');

    await createEventService.handleAuthEvent(new AuthEvent(Random.lorem, AuthActionEnum.LOGIN));

    expect(createSpy).toHaveBeenCalledWith({
      page: 'Система авторизации',
      type: EventTypeEnum.INFO,
      description: `Пользователь '${Random.lorem}' Авторизовался`,
      authData: `${Random.lorem}. Права: `,
    });
  });

  test('Should handleCreateEntityEvent', async () => {
    //@ts-ignore
    const createSpy = jest.spyOn(createEventService, 'create');

    await createEventService.handleCreateEntityEvent(
      new CreateEntityEvent(Random.lorem, Random.id, Random.id, Random.lorem),
    );

    expect(createSpy).toHaveBeenCalledWith({
      page: Random.lorem,
      type: EventTypeEnum.INFO,
      description: `Пользователь id=${Random.id} создал ${Random.lorem} id=${Random.id}`,
    });
  });

  test('Should handleEducationRequestEvent', async () => {
    //@ts-ignore
    const createSpy = jest.spyOn(createEventService, 'create');

    await createEventService.handleEducationRequestEvent(new EducationRequestEvent(Random.id, Random.id, Random.lorem));

    expect(createSpy).toHaveBeenCalledWith({
      page: Random.lorem,
      type: EventTypeEnum.INFO,
      description: `Пользователь id=${Random.id} подал заявку на зачисление id=${Random.id}`,
    });
  });

  test('Should handleEducationRequestAcceptEvent', async () => {
    //@ts-ignore
    const createSpy = jest.spyOn(createEventService, 'create');

    await createEventService.handleEducationRequestAcceptEvent(
      new EducationRequestAcceptEvent(Random.id, Random.id, EducationElementTypeEnum.TEST, Random.id, Random.id, ''),
    );

    expect(createSpy).toHaveBeenCalledWith({
      page: 'Зачисления',
      type: EventTypeEnum.INFO,
      description: `Пользователь id=${Random.id} утвердил заявку на обучение id=${Random.id}`,
    });
  });

  test('Should handleEducationRequestRejectEvent', async () => {
    //@ts-ignore
    const createSpy = jest.spyOn(createEventService, 'create');

    await createEventService.handleEducationRequestRejectEvent(
      new EducationRequestAcceptEvent(Random.id, Random.id, EducationElementTypeEnum.TEST, Random.id, Random.id, ''),
    );

    expect(createSpy).toHaveBeenCalledWith({
      page: 'Зачисления',
      type: EventTypeEnum.INFO,
      description: `Пользователь id=${Random.id} отклонил заявку на обучение id=${Random.id}`,
    });
  });

  test('Should handleAddLibraryFileEvent', async () => {
    //@ts-ignore
    const createSpy = jest.spyOn(createEventService, 'create');

    await createEventService.handleAddLibraryFileEvent(new AddLibraryFileEvent(Random.id, Random.id));

    expect(createSpy).toHaveBeenCalledWith({
      page: 'Библиотека',
      type: EventTypeEnum.INFO,
      description: `Пользователь id=${Random.id} добавил в библиотеку файл id=${Random.id}`,
    });
  });

  test('Should handleAddInstallerEvent', async () => {
    //@ts-ignore
    const createSpy = jest.spyOn(createEventService, 'create');

    await createEventService.handleAddInstallerEvent(new AddLibraryFileEvent(Random.id, Random.id));

    expect(createSpy).toHaveBeenCalledWith({
      page: 'Инсталляторы',
      type: EventTypeEnum.INFO,
      description: `Пользователь id=${Random.id} добавил инсталлятор id=${Random.id}`,
    });
  });

  test('Should handleSendMessageEvent', async () => {
    //@ts-ignore
    const createSpy = jest.spyOn(createEventService, 'create');

    await createEventService.handleSendMessageEvent(new SendMessageEvent(Random.id));

    expect(createSpy).toHaveBeenCalledWith({
      page: 'Сообщения',
      type: EventTypeEnum.INFO,
      description: `Пользователь id=${Random.id} отправил сообщение`,
    });
  });

  test('Should handleAddVerificationDocumentEvent', async () => {
    //@ts-ignore
    const createSpy = jest.spyOn(createEventService, 'create');

    await createEventService.handleAddVerificationDocumentEvent(new AddLibraryFileEvent(Random.id, Random.id));

    expect(createSpy).toHaveBeenCalledWith({
      page: 'Удостоверяющий центр',
      type: EventTypeEnum.INFO,
      description: `Пользователь id=${Random.id} добавил документ удостоверяющего центра id=${Random.id}`,
    });
  });

  test('Should handleUpdateEntityEvent', async () => {
    //@ts-ignore
    const createSpy = jest.spyOn(createEventService, 'create');

    await createEventService.handleUpdateEntityEvent(new UpdateEntityEvent(Random.lorem, Random.id, Random.lorem, {}));

    expect(createSpy).toHaveBeenCalledWith({
      page: Random.lorem,
      type: EventTypeEnum.INFO,
      description: `Пользователь id=${Random.id} внёс изменения в ${Random.lorem}. Новое значение: ${JSON.stringify(
        {},
      )}`,
    });
  });

  test('Should handleUpdateForumTheme', async () => {
    //@ts-ignore
    const createSpy = jest.spyOn(createEventService, 'create');

    await createEventService.handleUpdateForumTheme(
      new UpdateForumThemeEvent(Random.id, ThemeActionEnum.OPEN, Random.id),
    );

    expect(createSpy).toHaveBeenCalledWith({
      page: 'Форум',
      type: EventTypeEnum.INFO,
      description: `Пользователь id=${Random.id} ${ThemeActionEnum.OPEN} тему форума id=${Random.id}`,
    });
  });

  test('Should handleTruncateEvent', async () => {
    //@ts-ignore
    const createSpy = jest.spyOn(createEventService, 'create');

    await createEventService.handleTruncateEvent(new TruncateEventEvent(Random.id));

    expect(createSpy).toHaveBeenCalledWith({
      page: 'Журнал событий',
      type: EventTypeEnum.INFO,
      description: `Пользователь id=${Random.id} очистил журнал событий`,
    });
  });

  test('Should handleStartTrainingEvent', async () => {
    //@ts-ignore
    const createSpy = jest.spyOn(createEventService, 'create');

    await createEventService.handleStartTrainingEvent(new StartTrainingEvent(Random.id, Random.id));

    expect(createSpy).toHaveBeenCalledWith({
      page: 'Моё расписание',
      type: EventTypeEnum.INFO,
      description: `Пользователь id=${Random.id} начал обучение по попытке id=${Random.id}`,
    });
  });

  test('Should handleEndTrainingEvent', async () => {
    //@ts-ignore
    const createSpy = jest.spyOn(createEventService, 'create');

    await createEventService.handleEndTrainingEvent(new StartTrainingEvent(Random.id, Random.id));

    expect(createSpy).toHaveBeenCalledWith({
      page: 'Моё расписание',
      type: EventTypeEnum.INFO,
      description: `Пользователь id=${Random.id} закончил обучение по попытке id=${Random.id}`,
    });
  });

  test('Should handleChangeOrderEvent', async () => {
    //@ts-ignore
    const createSpy = jest.spyOn(createEventService, 'create');

    await createEventService.handleChangeOrderEvent(
      new ChangeOrderEvent(Random.id, Random.id, Random.lorem, Random.lorem),
    );

    expect(createSpy).toHaveBeenCalledWith({
      page: Random.lorem,
      type: EventTypeEnum.INFO,
      description: `Пользователь id=${Random.id} отсортировал  ${Random.lorem} id=${Random.id}`,
    });
  });

  afterEach(() => {
    clearAllMocks();
  });
});

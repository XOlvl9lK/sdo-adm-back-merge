import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventRepository } from '@modules/event/infrastructure/database/event.repository';
import { OnEvent } from '@nestjs/event-emitter';
import { EventEntity, EventTypeEnum } from '@modules/event/domain/event.entity';
import { CreateEventDto } from '@modules/event/controllers/dtos/create-event.dto';
import { AuthActionEnum, AuthEvent } from '@modules/event/infrastructure/events/auth.event';
import { CreateEntityEvent } from '@modules/event/infrastructure/events/create-entity.event';
import { EducationRequestEvent } from '@modules/event/infrastructure/events/education-request.event';
import { EducationRequestAcceptEvent } from '@modules/event/infrastructure/events/education-request-accept.event';
import { AddLibraryFileEvent } from '@modules/event/infrastructure/events/add-library-file.event';
import { SendMessageEvent } from '@modules/event/infrastructure/events/send-message.event';
import { UpdateEntityEvent } from '@modules/event/infrastructure/events/update-entity.event';
import { UpdateForumThemeEvent } from '@modules/event/infrastructure/events/update-forum-theme.event';
import { TruncateEventEvent } from '@modules/event/infrastructure/events/truncate-event.event';
import { StartTrainingEvent } from '@modules/event/infrastructure/events/start-training.event';
import { ChangeOrderEvent } from '@modules/event/infrastructure/events/change-order.event';
import { GroupEnrolledEvent } from '@modules/event/infrastructure/events/group-enrolled.event';
import { UserEnrolledEvent } from '@modules/event/infrastructure/events/user-enrolled.event';
import { ErrorEvent } from '@modules/event/infrastructure/events/error.event';

export enum EventActionEnum {
  AUTH = 'AUTH',
  CREATE_ENTITY = 'CREATE_ENTITY',
  EDUCATION_REQUEST = 'EDUCATION_REQUEST',
  EDUCATION_REQUEST_ACCEPT = 'EDUCATION_REQUEST_ACCEPT',
  EDUCATION_REQUEST_REJECT = 'EDUCATION_REQUEST_REJECT',
  ADD_LIBRARY_FILE = 'ADD_LIBRARY_FILE',
  ADD_INSTALLER = 'ADD_INSTALLER',
  SEND_MESSAGE = 'SEND_MESSAGE',
  ADD_VERIFICATION_DOCUMENT = 'ADD_VERIFICATION_DOCUMENT',
  UPDATE_ENTITY = 'UPDATE_ENTITY',
  UPDATE_FORUM_THEME = 'UPDATE_FORUM_THEME',
  TRUNCATE_EVENT = 'TRUNCATE_EVENT',
  START_TRAINING = 'START_TRAINING',
  END_TRAINING = 'END_TRAINING',
  CHANGE_ORDER = 'CHANGE_ORDER',
  MESSAGE_READ = 'MESSAGE_READ',
  DOWNLOAD_FILE = 'DOWNLOAD_FILE',
  ENROLLED = 'ENROLLED',
  SELF_ENROLLED = 'SELF_ENROLLED',
  GROUP_ENROLLED = 'GROUP_ENROLLED',
  FORUM_MESSAGE_CREATED = 'FORUM_MESSAGE_CREATED',
  THEME_CREATED = 'THEME_CREATED',
  OBLIGATORY_UPDATED = 'OBLIGATORY_UPDATED',
  CREATE_PERFORMANCE_ON_PROGRAM_SETTINGS_UPDATED = 'CREATE_PERFORMANCE_ON_PROGRAM_SETTINGS_UPDATED',
  DIB_USERS_IMPORT = 'DIB_USERS_IMPORT',
  DELIVER_ASSIGNMENTS_MESSAGES = 'DELIVER_ASSIGNMENTS_MESSAGES',
  ERROR = 'ERROR',
  GROUP_CHANGES = 'GROUP_CHANGES',
  EDUCATION_ELEMENT_ARCHIVED = 'EDUCATION_ELEMENT_ARCHIVED',
  EXPORT_TASK_PROGRESS = 'EXPORT_TASK_PROGRESS'
}

@Injectable()
export class CreateEventService {
  constructor(
    @InjectRepository(EventRepository)
    private eventRepository: EventRepository,
  ) {}

  async createMany() {
    const events = []
    for (let i = 0; i <= 10000; i++) {
      events.push(new EventEntity(EventTypeEnum.INFO, 'Тестовые данные', 'Тестовые данные'))
    }
    await this.eventRepository.save(events)
  }

  private async create({ object, page, type, description, authData }: CreateEventDto) {
    const event = new EventEntity(type, page, description, object, authData);
    await this.eventRepository.save(event);
  }

  @OnEvent(EventActionEnum.AUTH, { async: true })
  async handleAuthEvent(payload: AuthEvent) {
    const description = `Пользователь '${payload.login}' ${
      payload.action === AuthActionEnum.LOGIN ? 'Авторизовался' : 'Разлогинился'
    }`;
    const authData = `${payload.login}. Права: ${
      payload?.permissions?.map(permission => permission.description).join(', ') || ''
    }`;
    await this.create({
      page: 'Система авторизации',
      type: EventTypeEnum.INFO,
      description,
      authData,
    });
  }

  @OnEvent(EventActionEnum.CREATE_ENTITY, { async: true })
  async handleCreateEntityEvent(payload: CreateEntityEvent) {
    const description = `Пользователь id=${payload.userId} создал ${payload.entityName} id=${payload.entityId}`;
    await this.create({
      page: payload.page,
      type: EventTypeEnum.INFO,
      description,
    });
  }

  @OnEvent(EventActionEnum.EDUCATION_REQUEST, { async: true })
  async handleEducationRequestEvent(payload: EducationRequestEvent) {
    const description = `Пользователь id=${payload.userId} подал заявку на зачисление id=${payload.educationRequestId}`;
    await this.create({
      page: payload.page,
      type: EventTypeEnum.INFO,
      description,
    });
  }

  @OnEvent(EventActionEnum.EDUCATION_REQUEST_ACCEPT, { async: true })
  async handleEducationRequestAcceptEvent(payload: EducationRequestAcceptEvent) {
    const description = `Пользователь id=${payload.approverId} утвердил заявку на обучение id=${payload.educationRequestId}`;
    await this.create({
      page: 'Зачисления',
      type: EventTypeEnum.INFO,
      description,
    });
  }

  @OnEvent(EventActionEnum.EDUCATION_REQUEST_REJECT, { async: true })
  async handleEducationRequestRejectEvent(payload: EducationRequestAcceptEvent) {
    const description = `Пользователь id=${payload.userId} отклонил заявку на обучение id=${payload.educationRequestId}`;
    await this.create({
      page: 'Зачисления',
      type: EventTypeEnum.INFO,
      description,
    });
  }

  @OnEvent(EventActionEnum.ADD_LIBRARY_FILE, { async: true })
  async handleAddLibraryFileEvent(payload: AddLibraryFileEvent) {
    const description = `Пользователь id=${payload.userId} добавил в библиотеку файл id=${payload.libraryFileId}`;
    await this.create({
      page: 'Библиотека',
      type: EventTypeEnum.INFO,
      description,
    });
  }

  @OnEvent(EventActionEnum.ADD_INSTALLER, { async: true })
  async handleAddInstallerEvent(payload: AddLibraryFileEvent) {
    const description = `Пользователь id=${payload.userId} добавил инсталлятор id=${payload.libraryFileId}`;
    await this.create({
      page: 'Инсталляторы',
      type: EventTypeEnum.INFO,
      description,
    });
  }

  @OnEvent(EventActionEnum.SEND_MESSAGE, { async: true })
  async handleSendMessageEvent(payload: SendMessageEvent) {
    const description = `Пользователь id=${payload.userId} отправил сообщение`;
    await this.create({
      page: 'Сообщения',
      type: EventTypeEnum.INFO,
      description,
    });
  }

  @OnEvent(EventActionEnum.ADD_VERIFICATION_DOCUMENT, { async: true })
  async handleAddVerificationDocumentEvent(payload: AddLibraryFileEvent) {
    const description = `Пользователь id=${payload.userId} добавил документ удостоверяющего центра id=${payload.libraryFileId}`;
    await this.create({
      page: 'Удостоверяющий центр',
      type: EventTypeEnum.INFO,
      description,
    });
  }

  @OnEvent(EventActionEnum.UPDATE_ENTITY, { async: true })
  async handleUpdateEntityEvent(payload: UpdateEntityEvent) {
    const description = `Пользователь id=${payload.userId} внёс изменения в ${
      payload.entityName
    }. Новое значение: ${JSON.stringify(payload.newEntity)}`;
    await this.create({
      page: payload.page,
      type: EventTypeEnum.INFO,
      description,
    });
  }

  @OnEvent(EventActionEnum.UPDATE_FORUM_THEME, { async: true })
  async handleUpdateForumTheme(payload: UpdateForumThemeEvent) {
    const description = `Пользователь id=${payload.userId} ${payload.action} тему форума id=${payload.themeId}`;
    await this.create({ page: 'Форум', type: EventTypeEnum.INFO, description });
  }

  @OnEvent(EventActionEnum.TRUNCATE_EVENT, { async: true })
  async handleTruncateEvent(payload: TruncateEventEvent) {
    const description = `Пользователь id=${payload.userId} очистил журнал событий`;
    await this.create({
      page: 'Журнал событий',
      type: EventTypeEnum.INFO,
      description,
    });
  }

  @OnEvent(EventActionEnum.START_TRAINING, { async: true })
  async handleStartTrainingEvent(payload: StartTrainingEvent) {
    const description = `Пользователь id=${payload.userId} начал обучение по попытке id=${payload.attemptId}`;
    await this.create({
      page: 'Моё расписание',
      type: EventTypeEnum.INFO,
      description,
    });
  }

  @OnEvent(EventActionEnum.END_TRAINING, { async: true })
  async handleEndTrainingEvent(payload: StartTrainingEvent) {
    const description = `Пользователь id=${payload.userId} закончил обучение по попытке id=${payload.attemptId}`;
    await this.create({
      page: 'Моё расписание',
      type: EventTypeEnum.INFO,
      description,
    });
  }

  @OnEvent(EventActionEnum.CHANGE_ORDER, { async: true })
  async handleChangeOrderEvent(payload: ChangeOrderEvent) {
    const description = `Пользователь id=${payload.userId} отсортировал ${
      payload?.childEntityDesc ? payload.childEntityDesc : ``
    } ${payload.parentEntityName} id=${payload.parentEntityId}`;
    await this.create({
      page: payload.page,
      type: EventTypeEnum.INFO,
      description,
    });
  }

  @OnEvent(EventActionEnum.GROUP_ENROLLED, { async: true })
  async handleGroupEnrolledEvent(payload: GroupEnrolledEvent) {
    const description = `Пользователь id=${payload.userId} зачислил группу id=${payload.groupId} на элемент обучения id=${payload.educationElementId}`;
    await this.create({
      page: 'Зачисления',
      type: EventTypeEnum.INFO,
      description,
    });
  }

  @OnEvent(EventActionEnum.ENROLLED, { async: true })
  async handleEnrolledEvent(payload: UserEnrolledEvent) {
    const description = `Пользователь id=${payload.viewerId} зачислил пользователя id=${payload.userId} на элемент обучения id=${payload.educationElementId}`;
    await this.create({
      page: 'Зачисления',
      type: EventTypeEnum.INFO,
      description,
    });
  }

  @OnEvent(EventActionEnum.SELF_ENROLLED, { async: true })
  async handleSelfEnrolledEvent(payload: UserEnrolledEvent) {
    const description = `Пользователь id=${payload.userId} зачислился на элемент обучения id=${payload.educationElementId}`;
    await this.create({
      page: 'Каталог элементов обучения',
      type: EventTypeEnum.INFO,
      description,
    });
  }

  @OnEvent(EventActionEnum.ERROR, { async: true })
  async handleErrorEvent(payload: ErrorEvent) {
    await this.create({
      page: payload.page,
      type: EventTypeEnum.ERROR,
      description: payload.description,
      object: payload.object ? JSON.stringify(payload.object) : '',
    });
  }
}

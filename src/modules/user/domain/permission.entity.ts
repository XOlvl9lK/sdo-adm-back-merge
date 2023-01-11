import { Column, Entity } from 'typeorm';
import { BaseEntity } from '@core/domain/base.entity';

@Entity('permission')
export class PermissionEntity extends BaseEntity {
  @Column({
    type: 'text',
    nullable: false,
    unique: true,
    comment: 'Код привилегии',
  })
  code: PermissionEnum;

  @Column({ type: 'text', nullable: true, comment: 'Описание привилегии' })
  description?: string;

  constructor(code: PermissionEnum, description?: string) {
    super();
    this.code = code;
    this.description = description;
  }
}

export enum PermissionEnum {
  PROGRAM_CREATE = 'program.create',
  PROGRAM_EDIT = 'program.edit',
  PROGRAM_ARCHIVE = 'program.archive',
  PROGRAM_SIGN_UP = 'program.signUp',
  CONTROL_GROUP_EDUCATION_ELEMENT = 'control.groupEducationElement',
  CONTROL_GROUP_PERIOD = 'control.groupPeriod',
  CONTROL_USER_EDUCATION_ELEMENT = 'control.userEducationElement',
  CONTROL = 'control',
  CONTROL_DRAW = 'control.draw',
  CONTROL_EXPORT = 'control.export',
  CONTROL_GROUP_PROGRAM = 'control.groupProgram',
  CONTROL_SESSIONS = 'control.sessions',
  CONTROL_SESSIONS_DELETE = 'control.sessionsDelete',
  CONTROL_PRINT = 'control.print',
  CONTROL_USER_PERIOD = 'control.userPeriod',
  CONTROL_USER_PROGRAM = 'control.userProgram',
  CONTROL_REGISTERED = 'control.registered',
  VERIFICATION_CENTRE_EDIT = 'verificationCentre.edit',
  TIMETABLE = 'timeTable',
  FORUM = 'forum',
  FORUM_MODERATION = 'forum.moderation',
  FORUM_OPEN_CLOSE = 'forum.openClose',
  FORUM_CREATE_THEME = 'forum.createTheme',
  FORUM_EDIT_MESSAGE = 'forum.editMessage',
  FORUM_EDIT_THEME = 'forum.editTheme',
  FORUM_CREATE_MESSAGE = 'forum.createMessage',
  FORUM_DELETE_MESSAGE = 'forum.deleteMessage',
  FORUM_ARCHIVE_THEME = 'forum.archiveTheme',
  ASSIGNMENT_CREATE = 'assignment.create',
  ASSIGNMENT_ARCHIVE = 'assignment.archive',
  ASSIGNMENT_USERS = 'assignment.viewUsers',
  ASSIGNMENT_ALL = 'assignment.all',
  ASSIGNMENT = 'assignment',
  NEWS_CREATE = 'news.create',
  NEWS_EDIT = 'news.edit',
  NEWS_ARCHIVE = 'news.archive',
  NEWS_GROUP = 'news.group',
  NEWS_GROUP_CREATE = 'news.groupCreate',
  NEWS_GROUP_EDIT = 'news.groupEdit',
  NEWS_GROUP_ARCHIVE = 'news.groupArchive',
  TEST_SIGN_UP = 'test.signUp',
  TEST_CREATE = 'test.create',
  TEST_EDIT = 'test.edit',
  TEST_ARCHIVE = 'test.archive',
  EDUCATION_REQUESTS = 'educationRequests',
  EDUCATION_REQUESTS_ACCEPT = 'educationRequests.accept',
  EDUCATION_REQUESTS_REJECT = 'educationRequests.reject',
  INSTALLERS = 'installers',
  INSTALLERS_CREATE = 'installers.create',
  LIBRARY = 'library',
  LIBRARY_CREATE = 'library.create',
  LIBRARY_EDIT = 'library.edit',
  LIBRARY_DELETE = 'library.delete',
  MESSAGE = 'message',
  MESSAGE_CREATE = 'message.create',
  PROFILE = 'profile',
  PROFILE_EDIT = 'profile.edit',
  PERFORMANCE = 'performance',
  GROUP = 'group',
  GROUP_CREATE = 'group.create',
  GROUP_EDIT = 'group.edit',
  GROUP_ARCHIVE = 'group.archive',
  LOGS = 'logs',
  LOGS_CLEAR = 'logs.clear',
  LOGS_EXPORT = 'logs.export',
  CONTENT_MANAGEMENT = 'contentManagement',
  PAGE_BANK = 'pageBank',
  PAGE_BANK_EDIT = 'pageBank.edit',
  QUESTION_BANK = 'questionBank',
  QUESTION_BANK_CREATE = 'questionBank.create',
  QUESTION_BANK_ARCHIVE = 'questionBank.archive',
  QUESTION_BANK_EDIT = 'questionBank.edit',
  CHAPTER = 'chapter',
  CHAPTER_CREATE = 'chapter.create',
  CHAPTER_EDIT = 'chapter.edit',
  CHAPTER_ARCHIVE = 'chapter.archive',
  USERS = 'users',
  USERS_CREATE = 'users.create',
  USERS_EDIT = 'users.edit',
  USERS_ARCHIVE = 'users.archive',
  COURSE_CREATE = 'course.create',
  COURSE_EDIT = 'course.edit',
  COURSE_ARCHIVE = 'course.archive',
  COURSE_SIGN_UP = 'course.signUp',
  TEST_ATTEMPT = 'testAttempt',
  ROLE = 'role',
  ROLE_CREATE = 'role.create',
  ROLE_EDIT = 'role.edit',
  ROLE_DELETE = 'role.delete',
  PROGRAM_SETTINGS = 'programSettings',
  PROGRAM_SETTINGS_CREATE = 'programSettings.create',
  PROGRAM_SETTINGS_EDIT = 'programSettings.edit',
  PROGRAM_SETTINGS_DELETE = 'programSettings.delete',
  DATA_EXPORT = 'dataExport'
}

export const PermissionCodeToDescriptionMap = {
  [PermissionEnum.PROGRAM_CREATE]: 'Создание программы обучения',
  [PermissionEnum.PROGRAM_EDIT]: 'Редактирование программ обучения',
  [PermissionEnum.PROGRAM_ARCHIVE]: 'Отправка программ обучения в архив/Возврат программ обучения из архива',
  [PermissionEnum.PROGRAM_SIGN_UP]: 'Запись на программу обучения',
  [PermissionEnum.CONTROL_GROUP_EDUCATION_ELEMENT]: 'Отчет "Обучение учебной группы по элементу обучения"',
  [PermissionEnum.CONTROL_GROUP_PERIOD]: 'Отчет "Обучение учебной группы за период"',
  [PermissionEnum.CONTROL_USER_EDUCATION_ELEMENT]: 'Отчет "Обучение пользователя по элементу обучения"',
  [PermissionEnum.CONTROL]: 'Доступ к разделу "Контроль"',
  [PermissionEnum.CONTROL_DRAW]: 'Формирование диаграмм по аналитическим отчётам',
  [PermissionEnum.CONTROL_EXPORT]: 'Экспорт аналитических отчетов во внешние файлы',
  [PermissionEnum.CONTROL_GROUP_PROGRAM]: 'Отчёт "Обучение группы по программе обучения"',
  [PermissionEnum.CONTROL_SESSIONS]: 'Отчет "Открытые сессии пользователей"',
  [PermissionEnum.CONTROL_SESSIONS_DELETE]: 'Удаление сессий пользователей',
  [PermissionEnum.CONTROL_PRINT]: 'Печать аналитических отчетов',
  [PermissionEnum.CONTROL_USER_PERIOD]: 'Отчет "Обучение пользователя за период"',
  [PermissionEnum.CONTROL_USER_PROGRAM]: 'Отчёт "Обучение пользователей по программе обучения"',
  [PermissionEnum.CONTROL_REGISTERED]: 'Отчет "Зарегистрированные пользователи"',
  [PermissionEnum.VERIFICATION_CENTRE_EDIT]: 'Редактирование файлов удостоверяющего центра',
  [PermissionEnum.TIMETABLE]: 'Просмотр собственного расписания',
  [PermissionEnum.FORUM]: 'Доступ к разделу "Форум"',
  [PermissionEnum.FORUM_MODERATION]: 'Модерирование форума',
  [PermissionEnum.FORUM_OPEN_CLOSE]: 'Открытие/закрытие собственных тем на форуме',
  [PermissionEnum.FORUM_CREATE_THEME]: 'Создание тем на форуме',
  [PermissionEnum.FORUM_EDIT_MESSAGE]: 'Редактирование собственных сообщений в темах на форуме',
  [PermissionEnum.FORUM_EDIT_THEME]: 'Редактирование собственных тем на форуме',
  [PermissionEnum.FORUM_CREATE_MESSAGE]: 'Создание сообщений в темах на форуме',
  [PermissionEnum.FORUM_DELETE_MESSAGE]: 'Удаление собственных сообщений в темах форума',
  [PermissionEnum.FORUM_ARCHIVE_THEME]: 'Отправка тем форума в архив/Возврат тем форума из архива',
  [PermissionEnum.ASSIGNMENT_CREATE]: 'Создание зачислений',
  [PermissionEnum.ASSIGNMENT_ARCHIVE]: 'Отправка зачислений в архив/Возврат зачислений из архива',
  [PermissionEnum.ASSIGNMENT_USERS]: 'Доступ к заявкам пользователей',
  [PermissionEnum.ASSIGNMENT_ALL]: 'Доступ ко всем зачислениям',
  [PermissionEnum.ASSIGNMENT]: 'Доступ к разделу "Зачисления"',
  [PermissionEnum.NEWS_CREATE]: 'Создание новостей',
  [PermissionEnum.NEWS_EDIT]: 'Редактирование новостей',
  [PermissionEnum.NEWS_ARCHIVE]: 'Отправка новостей в архив/Возврат новостей из архива',
  [PermissionEnum.NEWS_GROUP]: 'Доступ к банку новостей',
  [PermissionEnum.NEWS_GROUP_CREATE]: 'Создание групп новостей',
  [PermissionEnum.NEWS_GROUP_EDIT]: 'Редактирование групп новостей',
  [PermissionEnum.NEWS_GROUP_ARCHIVE]: 'Отправка групп новостей в архив/Возврат групп новостей из архива',
  [PermissionEnum.TEST_SIGN_UP]: 'Запись на тест',
  [PermissionEnum.TEST_CREATE]: 'Создание тестов',
  [PermissionEnum.TEST_EDIT]: 'Редактирование тестов',
  [PermissionEnum.TEST_ARCHIVE]: 'Отправка тестов в архив/Возврат тестов из архива',
  [PermissionEnum.EDUCATION_REQUESTS]: 'Просмотр собственных заявок на обучение',
  [PermissionEnum.EDUCATION_REQUESTS_ACCEPT]: 'Утверждение заявок на обучение',
  [PermissionEnum.EDUCATION_REQUESTS_REJECT]: 'Отклонение заявок на обучение',
  [PermissionEnum.INSTALLERS]: 'Доступ к разделу "Инсталляторы"',
  [PermissionEnum.INSTALLERS_CREATE]: 'Добавление новых инсталляторов',
  [PermissionEnum.LIBRARY]: 'Доступ к разделу "Библиотека"',
  [PermissionEnum.LIBRARY_CREATE]: 'Добавление новых файлов в библиотеку',
  [PermissionEnum.LIBRARY_EDIT]: 'Редактирование файлов библиотеки',
  [PermissionEnum.LIBRARY_DELETE]: 'Удаление файлов из библиотеки',
  [PermissionEnum.MESSAGE]: 'Доступ к разделу "Сообщения"',
  [PermissionEnum.MESSAGE_CREATE]: 'Создание и отправка сообщений',
  [PermissionEnum.PROFILE]: 'Доступ к личным данным',
  [PermissionEnum.PROFILE_EDIT]: 'Редактирование личных данных',
  [PermissionEnum.PERFORMANCE]: 'Доступ к разделу "Успеваемость"',
  [PermissionEnum.GROUP]: 'Доступ к разделу "Группы"',
  [PermissionEnum.GROUP_CREATE]: 'Создание групп пользователей',
  [PermissionEnum.GROUP_EDIT]: 'Редактирование групп пользователей',
  [PermissionEnum.GROUP_ARCHIVE]: 'Отправка групп в архив/Возврат групп из архива',
  [PermissionEnum.LOGS]: 'Доступ к журналу событий',
  [PermissionEnum.LOGS_CLEAR]: 'Очищение журнала событий',
  [PermissionEnum.LOGS_EXPORT]: 'Экспорт журнала событий во внешний файл',
  [PermissionEnum.CONTENT_MANAGEMENT]: 'Доступ к разделу "Управление содержимым"',
  [PermissionEnum.PAGE_BANK]: 'Доступ к банку страниц',
  [PermissionEnum.PAGE_BANK_EDIT]: 'Редактирование контента в банке страниц',
  [PermissionEnum.QUESTION_BANK]: 'Доступ к банку вопросов',
  [PermissionEnum.QUESTION_BANK_CREATE]: 'Создание вопросов и тем тестов',
  [PermissionEnum.QUESTION_BANK_ARCHIVE]: 'Отправка тем и вопросов в архив/Возврат тем и вопросов из архива',
  [PermissionEnum.QUESTION_BANK_EDIT]: 'Редактирование тем тестов',
  [PermissionEnum.CHAPTER]: 'Доступ к разделам элементов обучения',
  [PermissionEnum.CHAPTER_CREATE]: 'Создание разделов элементов обучения',
  [PermissionEnum.CHAPTER_EDIT]: 'Редактирование разделов элементов обучения',
  [PermissionEnum.CHAPTER_ARCHIVE]:
    'Отправка разделов элементов обучения в архив/Возврат разделов элементов обучения из архива',
  [PermissionEnum.USERS]: 'Доступ к разделу "Пользователи"',
  [PermissionEnum.USERS_CREATE]: 'Создание пользователей',
  [PermissionEnum.USERS_EDIT]: 'Редактирование пользователей',
  [PermissionEnum.USERS_ARCHIVE]: 'Отправка пользователей в архив/Возврат пользователей из архива',
  [PermissionEnum.COURSE_CREATE]: 'Создание курсов дистанционного обучения',
  [PermissionEnum.COURSE_EDIT]: 'Редактирование курсов дистанционного обучения',
  [PermissionEnum.COURSE_ARCHIVE]: 'Отправка курсов в архив/Возврат курсов из архива',
  [PermissionEnum.COURSE_SIGN_UP]: 'Запись на курс дистанционного обучения',
  [PermissionEnum.TEST_ATTEMPT]: 'Создание тестовой попытки',
  [PermissionEnum.ROLE]: 'Доступ к разделу "Роли и права"',
  [PermissionEnum.ROLE_CREATE]: 'Создание роли',
  [PermissionEnum.ROLE_EDIT]: 'Редактирование роли',
  [PermissionEnum.ROLE_DELETE]: 'Удаление роли',
  [PermissionEnum.PROGRAM_SETTINGS]: 'Доступ к разделу "Настройки программ обучения"',
  [PermissionEnum.PROGRAM_SETTINGS_CREATE]: 'Создание настройки программы обучения',
  [PermissionEnum.PROGRAM_SETTINGS_EDIT]: 'Редактирование настройки программы обучения',
  [PermissionEnum.PROGRAM_SETTINGS_DELETE]: 'Удаление настройки программы обучения',
  [PermissionEnum.DATA_EXPORT]: 'Доступ к разделу "Экспорт данных"',
};

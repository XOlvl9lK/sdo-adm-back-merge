import { Constructor } from '@core/libs/types';
import { EducationProgramEntity } from '@modules/education-program/domain/education-program.entity';
import {
  CourseProgramElementEntity,
  TestProgramElementEntity
} from '@modules/education-program/domain/program-element.entity';
import { match, MatchResult, pathToRegexp } from 'path-to-regexp';
import { each, get } from 'lodash';
import { CourseEntity } from '@modules/course/domain/course.entity';
import { TestEntity, ThemeInTestEntity } from '@modules/test/domain/test.entity';
import { TestThemeEntity } from '@modules/test/domain/test-theme.entity';
import {
  CoursePerformanceEntity,
  EducationProgramPerformanceEntity,
  TestPerformanceEntity
} from '@modules/performance/domain/performance.entity';
import { UserEducationRequestEntity } from '@modules/education-request/domain/education-request.entity';
import { UserEntity } from '@modules/user/domain/user.entity';
import { ThemeEntity } from '@modules/forum/domain/theme.entity';
import { ForumEntity } from '@modules/forum/domain/forum.entity';
import { NewsEntity } from '@modules/news/domain/news.entity';
import { NewsGroupEntity } from '@modules/news/domain/news-group.entity';
import { GroupEntity } from '@modules/group/domain/group.entity';
import { EventEntity } from '@modules/event/domain/event.entity';
import { RoleEntity } from '@modules/user/domain/role.entity';

type ResolvedBreadcrumb = {
  entity: Constructor | Constructor[]
  href: string
  relations?: string[]
  titlePath?: string | string[]
}

export class BreadcrumbResolver {
  private readonly _matchResult: MatchResult
  private readonly _matchKey: string

  constructor(location: string) {
    const breadcrumbKeys = Object.keys(this._breadcrumbs)
    for (let i = 0; i < breadcrumbKeys.length; i++) {
      const matchFunction = match(pathToRegexp(breadcrumbKeys[i]))
      const matched = matchFunction(location)
      if (matched) {
        this._matchResult = matched
        this._matchKey = breadcrumbKeys[i]
        break
      }
    }
    this.resolveHref = this.resolveHref.bind(this)
  }

  get matchResult() {
    return this._matchResult
  }

  get breadcrumbs() {
    return this._breadcrumbs[this._matchKey]
  }

  resolveHref(href: string) {
    let internalHref = href
    each(this._matchResult.params, (value, key) => {
      internalHref = internalHref.replace('$' + key, value)
    })
    return internalHref
  }

  resolveLabel(entity: any, breadcrumb: ResolvedBreadcrumb) {
    if (breadcrumb.titlePath) {
      if (Array.isArray(breadcrumb.titlePath)) {
        let label = ''
        each(breadcrumb.titlePath, titlePath => {
          const labelCandidate = get(entity, titlePath)
          if (labelCandidate) label = labelCandidate
        })
        return label
      } else {
        return get(entity, breadcrumb.titlePath) || ''
      }
    }
    return entity?.title || ''
  }

  private _breadcrumbs: {
    [key: string]: ([string, string] | ResolvedBreadcrumb)[]
  } = {
    '/': [['Главная', '/']],

    '/profile': [['Главная', '/'], ['Профиль', '/profile']],

    '/sitemap': [['Главная', '/'], ['Карта сайта', '/sitemap']],

    '/catalog/education-program': [['Главная', '/'], ['Программы обучения', '/catalog/education-program']],
    '/catalog/education-program/:id': [['Главная', '/'], ['Программы обучения', '/catalog/education-program'], { entity: EducationProgramEntity, href: '/catalog/education-program/$0' }],
    '/catalog/education-program/:id/test/:id': [['Главная', '/'], ['Программы обучения', '/catalog/education-program'], { entity: EducationProgramEntity, href: '/catalog/education-program/$0' }, { entity: TestProgramElementEntity, relations: ['test'], titlePath: 'test.title', href: '/catalog/education-program/$0/test/$1' }],
    '/catalog/education-program/:id/course/:id': [['Главная', '/'], ['Программы обучения', '/catalog/education-program'], { entity: EducationProgramEntity, href: '/catalog/education-program/$0' }, { entity: CourseProgramElementEntity, relations: ['course'], titlePath: 'course.title', href: '/catalog/education-program/$0/course/$1' }],
    '/catalog/education-program/:id/test/:id/test-attempt': [['Главная', '/'], ['Программы обучения', '/catalog/education-program'], { entity: EducationProgramEntity, href: '/catalog/education-program/$0' }, { entity: TestProgramElementEntity, relations: ['test'], titlePath: 'test.title', href: '/catalog/education-program/$0/test/$1' }, ['Тестовая попытка', '/catalog/education-program/$0/test/$1/test-attempt']],

    '/catalog/course': [['Главная', '/'], ['Курсы дистанционного обучения', '/catalog/course']],
    '/catalog/course/:id': [['Главная', '/'], ['Курсы дистанционного обучения', '/catalog/course'], { entity: CourseEntity, href: '/catalog/course/$0' }],

    '/catalog/test': [['Главная', '/'], ['Тесты', '/catalog/test']],
    '/catalog/test/:id': [['Главная', '/'], ['Тесты', '/catalog/test'], { entity: TestEntity, href: '/catalog/test/$0' }],
    '/catalog/test/:id/test-attempt': [['Главная', '/'], ['Тесты', '/catalog/test'], { entity: TestEntity, href: '/catalog/test/$0' }, ['Тестовая попытка', '/catalog/test/$0/test-attempt']],
    '/catalog/test/:id/:id': [['Главная', '/'], ['Тесты', '/catalog/test'], { entity: TestEntity, href: '/catalog/test/$0' }, { entity: ThemeInTestEntity, href: '/catalog/test/$0/$1', relations: ['theme'], titlePath: 'theme.title' }],
    '/catalog/test/:id/:id/add-questions': [['Главная', '/'], ['Тесты', '/catalog/test'], { entity: TestEntity, href: '/catalog/test/$0' }, { entity: ThemeInTestEntity, href: '/catalog/test/$0/$1', relations: ['theme'], titlePath: 'theme.title' }, ['Добавление вопросов', '/catalog/test/$0/$1/add-questions']],

    '/catalog/question-bank': [['Главная', '/'], ['Банк вопросов', '/catalog/question-bank']],
    '/catalog/question-bank/:id': [['Главная', '/'], ['Банк вопросов', '/catalog/question-bank'], { entity: TestThemeEntity, href: '/catalog/question-bank/$0' }],
    '/catalog/question-bank/:id/:id': [['Главная', '/'], ['Банк вопросов', '/catalog/question-bank'], { entity: TestThemeEntity, href: '/catalog/question-bank/$0' }, ['Просмотр вопроса', '/catalog/question-bank/$0/$1']],

    '/catalog/program-settings': [['Главная', '/'], ['Настройки программ обучения', '/catalog/program-settings']],

    '/education/timetable': [['Главная', '/'], ['Мое расписание', '/education/timetable']],
    '/education/timetable/course/:id': [['Главная', '/'], ['Мое расписание', '/education/timetable'], { entity: CoursePerformanceEntity, relations: ['course'], titlePath: 'course.title', href: '/education/timetable/course/$0' }],
    '/education/timetable/test/:id': [['Главная', '/'], ['Мое расписание', '/education/timetable'], { entity: TestPerformanceEntity, relations: ['test'], titlePath: 'test.title', href: '/education/timetable/test/$0' }],
    '/education/timetable/test/:id/:id/test-result': [['Главная', '/'], ['Мое расписание', '/education/timetable'], { entity: TestPerformanceEntity, relations: ['test'], titlePath: 'test.title', href: '/education/timetable/test/$0' }, ['Результаты теста', '/education/timetable/test/$0/$1/test-result']],
    '/education/timetable/test/:id/:id/test-result/view-answers': [['Главная', '/'], ['Мое расписание', '/education/timetable'], { entity: TestPerformanceEntity, relations: ['test'], titlePath: 'test.title', href: '/education/timetable/test/$0' }, ['Результаты теста', '/education/timetable/test/$0/$1/test-result'], ['Протокол прохождения', '/education/timetable/test/$0/$1/test-result/view-answers']],
    '/education/timetable/program/:id': [['Главная', '/'], ['Мое расписание', '/education/timetable'], { entity: EducationProgramPerformanceEntity, relations: ['educationProgram'], titlePath: 'educationProgram.title', href: '/education/timetable/program/$0' }],
    '/education/timetable/program/:id/test/:id': [['Главная', '/'], ['Мое расписание', '/education/timetable'], { entity: EducationProgramPerformanceEntity, relations: ['educationProgram'], titlePath: 'educationProgram.title', href: '/education/timetable/program/$0' }, { entity: TestPerformanceEntity, relations: ['test'], titlePath: 'test.title', href: '/education/timetable/program/$0/test/$1' }],
    '/education/timetable/program/:id/test/:id/:id/test-result': [['Главная', '/'], ['Мое расписание', '/education/timetable'], { entity: EducationProgramPerformanceEntity, relations: ['educationProgram'], titlePath: 'educationProgram.title', href: '/education/timetable/program/$0' }, { entity: TestPerformanceEntity, relations: ['test'], titlePath: 'test.title', href: '/education/timetable/program/$0/test/$1' }, ['Результаты теста', '/education/timetable/program/$0/test/$1/$2/test-result']],
    '/education/timetable/program/:id/test/:id/:id/test-result/view-answers': [['Главная', '/'], ['Мое расписание', '/education/timetable'], { entity: EducationProgramPerformanceEntity, relations: ['educationProgram'], titlePath: 'educationProgram.title', href: '/education/timetable/program/$0' }, { entity: TestPerformanceEntity, relations: ['test'], titlePath: 'test.title', href: '/education/timetable/program/$0/test/$1' }, ['Результаты теста', '/education/timetable/program/$0/test/$1/$2/test-result'], ['Протокол прохождения', '/education/timetable/program/$0/test/$1/$2/test-result/view-answers']],
    '/education/timetable/program/:id/course/:id': [['Главная', '/'], ['Мое расписание', '/education/timetable'], { entity: EducationProgramPerformanceEntity, relations: ['educationProgram'], titlePath: 'educationProgram.title', href: '/education/timetable/program/$0' }, { entity: CoursePerformanceEntity, relations: ['course'], titlePath: 'course.title', href: '/education/timetable/program/$0/course/$1' }],

    '/education/request': [['Главная', '/'], ['Мои заявки', '/education/request']],
    '/education/request/:id': [['Главная', '/'], ['Мои заявки', '/education/request'], { entity: UserEducationRequestEntity, relations: ['educationElement'], titlePath: 'educationElement.title', href: '/education/request/$0' }],

    '/performance': [['Главная', '/'], ['Успеваемость', '/performance']],
    '/performance/test/:id': [['Главная', '/'], ['Успеваемость', '/performance'], { entity: TestPerformanceEntity, relations: ['test'], titlePath: 'test.title', href: '/performance/test/$0' }],
    '/performance/course/:id': [['Главная', '/'], ['Успеваемость', '/performance'], { entity: CoursePerformanceEntity, relations: ['course'], titlePath: 'course.title', href: '/performance/course/$0' }],
    '/performance/program/:id': [['Главная', '/'], ['Успеваемость', '/performance'], { entity: EducationProgramPerformanceEntity, relations: ['educationProgram'], titlePath: 'educationProgram.title', href: '/performance/program/$0' }],
    '/performance/program/:id/test/:id': [['Главная', '/'], ['Успеваемость', '/performance'], { entity: EducationProgramPerformanceEntity, relations: ['educationProgram'], titlePath: 'educationProgram.title', href: '/performance/program/$0' }, { entity: TestPerformanceEntity, relations: ['test'], titlePath: 'test.title', href: '/performance/program/$0/test/$1' }],
    '/performance/program/:id/course/:id': [['Главная', '/'], ['Успеваемость', '/performance'], { entity: EducationProgramPerformanceEntity, relations: ['educationProgram'], titlePath: 'educationProgram.title', href: '/performance/program/$0' }, { entity: CoursePerformanceEntity, relations: ['course'], titlePath: 'course.title', href: '/performance/program/$0/course/$1' }],

    '/enrollment/first-step': [['Главная', '/'], ['Зачисления', '/enrollment/first-step'], ['Зачисление', '/enrollment/first-step']],
    '/enrollment/second-step': [['Главная', '/'], ['Зачисления', '/enrollment/second-step'], ['Зачисление', '/enrollment/second-step']],
    '/enrollment/third-step': [['Главная', '/'], ['Зачисления', '/enrollment/third-step'], ['Зачисление', '/enrollment/third-step']],
    '/enrollment/requests': [['Главная', '/'], ['Зачисления', '/enrollment'], ['Заявки пользователей', '/enrollment/requests']],
    '/enrollment/requests/:id': [['Главная', '/'], ['Зачисления', '/enrollment'], ['Заявки пользователей', '/enrollment/requests'], { entity: UserEntity, titlePath: 'login', href: '/enrollment/requests/$0' }],
    '/enrollment/requests/:id/test/:id': [['Главная', '/'], ['Зачисления', '/enrollment'], ['Заявки пользователей', '/enrollment/requests'], { entity: UserEntity, titlePath: 'login', href: '/enrollment/requests/$0' }, { entity: TestEntity, href: '/enrollment/requests/$0/test/$1' }],
    '/enrollment/requests/:id/program/:id': [['Главная', '/'], ['Зачисления', '/enrollment'], ['Заявки пользователей', '/enrollment/requests'], { entity: UserEntity, titlePath: 'login', href: '/enrollment/requests/$0' }, { entity: EducationProgramEntity, href: '/enrollment/requests/$0/program/$1' }],
    '/enrollment/requests/:id/course/:id': [['Главная', '/'], ['Зачисления', '/enrollment'], ['Заявки пользователей', '/enrollment/requests'], { entity: UserEntity, titlePath: 'login', href: '/enrollment/requests/$0' }, { entity: CourseEntity, href: '/enrollment/requests/$0/course/$1' }],
    '/enrollment/all': [['Главная', '/'], ['Зачисления', '/enrollment'], ['Все зачисления', '/enrollment/all']],
    '/enrollment/all/:id': [['Главная', '/'], ['Зачисления', '/enrollment'], ['Все зачисления', '/enrollment/all'], { entity: [UserEntity, GroupEntity], titlePath: ['login', 'title'], href: '/enrollment/all/$0' }],
    '/enrollment/all/:id/test/:id': [['Главная', '/'], ['Зачисления', '/enrollment'], ['Все зачисления', '/enrollment/all'], { entity: [UserEntity, GroupEntity], titlePath: ['login', 'title'], href: '/enrollment/all/$0' }, { entity: TestEntity, href: '/enrollment/all/$0/test/$1' }],
    '/enrollment/all/:id/program/:id': [['Главная', '/'], ['Зачисления', '/enrollment'], ['Все зачисления', '/enrollment/all'], { entity: [UserEntity, GroupEntity], titlePath: ['login', 'title'], href: '/enrollment/all/$0' }, { entity: EducationProgramEntity, href: '/enrollment/all/$0/program/$1' }],
    '/enrollment/all/:id/course/:id': [['Главная', '/'], ['Зачисления', '/enrollment'], ['Все зачисления', '/enrollment/all'], { entity: [UserEntity, GroupEntity], titlePath: ['login', 'title'], href: '/enrollment/all/$0' }, { entity: CourseEntity, href: '/enrollment/all/$0/course/$1' }],

    '/forum': [['Главная', '/'], ['Форум', '/forum']],
    '/forum/search': [['Главная', '/'], ['Форум', '/forum'], ['Поиск', '/forum/search']],
    '/forum/:id': [['Главная', '/'], ['Форум', '/forum'], { entity: ForumEntity, href: '/forum/$0' }],
    '/forum/:id/:id': [['Главная', '/'], ['Форум', '/forum'], { entity: ForumEntity, href: '/forum/$0' }, { entity: ThemeEntity, href: '/forum/$0/$1' }],

    '/news': [['Главная', '/'], ['Новости', '/news']],
    '/news/group': [['Главная', '/'], ['Новости', '/news'], ['Группа новостей', '/news/group']],
    '/news/group/:id': [['Главная', '/'], ['Новости', '/news'], { entity: NewsGroupEntity, href: '/news/group/$0' }],
    '/news/group/:id/:id': [['Главная', '/'], ['Новости', '/news'], { entity: NewsGroupEntity, href: '/news/group/$0' }, { entity: NewsEntity, href: '/news/group/$0/$1' }],
    '/news/:id': [['Главная', '/'], ['Новости', '/news'], { entity: NewsEntity, href: '/news/$0' }],

    '/messages/all': [['Главная', '/'], ['Сообщения', '/messages/all'], ['Все', '/messages/all']],
    '/messages/all/:id': [['Главная', '/'], ['Сообщения', '/messages/all'], ['Все', '/messages/all'], ['Сообщение', '/messages/all/$0']],
    '/messages/incoming': [['Главная', '/'], ['Сообщения', '/messages/all'], ['Входящие', '/messages/incoming']],
    '/messages/incoming/:id': [['Главная', '/'], ['Сообщения', '/messages/all'], ['Входящие', '/messages/incoming'], ['Сообщение', '/messages/incoming/$0']],
    '/messages/outgoing': [['Главная', '/'], ['Сообщения', '/messages/all'], ['Отправленные', '/messages/outgoing']],
    '/messages/outgoing/:id': [['Главная', '/'], ['Сообщения', '/messages/all'], ['Отправленные', '/messages/outgoing'], ['Сообщение', '/messages/outgoing/$0']],
    '/messages/draft': [['Главная', '/'], ['Сообщения', '/messages/all'], ['Черновики', '/messages/draft']],
    '/messages/draft/:id': [['Главная', '/'], ['Сообщения', '/messages/all'], ['Черновики', '/messages/draft'], ['Сообщение', '/messages/draft/$0']],
    '/messages/basket': [['Главная', '/'], ['Сообщения', '/messages/all'], ['Корзина', '/messages/basket']],
    '/messages/basket/:id': [['Главная', '/'], ['Сообщения', '/messages/all'], ['Корзина', '/messages/basket'], ['Сообщение', '/messages/basket/$0']],

    '/users': [['Главная', '/'], ['Пользователи', '/users']],
    '/users/sessions': [['Главная', '/'], ['Пользователи', '/users'], ['Активные сессии пользователей', '/users/sessions']],

    '/groups': [['Главная', '/'], ['Группы', '/groups']],
    '/groups/:id': [['Главная', '/'], ['Группы', '/groups'], { entity: GroupEntity, href: '/groups/$0' }],

    '/library': [['Главная', '/'], ['Библиотека', '/library']],

    '/installers/win': [['Главная', '/'], ['Инсталляторы', '/installers/win'], ['АРМ «Правовая статистика», АРМ КУСП для Windows', '/installers/win']],
    '/installers/lin': [['Главная', '/'], ['Инсталляторы', '/installers/lin'], ['АРМ «Правовая статистика», АРМ КУСП для Linux', '/installers/lin']],
    '/installers/meta': [['Главная', '/'], ['Инсталляторы', '/installers/meta'], ['Инсталлятор метаданных', '/installers/meta']],

    '/verification': [['Главная', '/'], ['Удостоверяющий центр', '/verification']],
    '/verification/normative': [['Главная', '/'], ['Удостоверяющий центр', '/verification'], ['Нормативные документы', '/verification/normative']],
    '/verification/license': [['Главная', '/'], ['Удостоверяющий центр', '/verification'], ['Лицензии и сертификаты', '/verification/license']],
    '/verification/root': [['Главная', '/'], ['Удостоверяющий центр', '/verification'], ['Корневые сертификаты', '/verification/root']],
    '/verification/revoked': [['Главная', '/'], ['Удостоверяющий центр', '/verification'], ['Списки отозванных сертификатов', '/verification/revoked']],

    '/contacts': [['Главная', '/'], ['Контакты', '/contacts']],

    '/content-management/news-bank': [['Главная', '/'], ['Управление содержимым', '/content-management/news-bank'], ['Банк новостей', '/content-management/news-bank']],
    '/content-management/news-bank/:id': [['Главная', '/'], ['Управление содержимым', '/content-management/news-bank'], ['Банк новостей', '/content-management/news-bank'], { entity: NewsGroupEntity, href: '/content-management/news-bank/$0' }],
    '/content-management/chapters': [['Главная', '/'], ['Управление содержимым', '/content-management/news-bank'], ['Разделы элементов обучения', '/content-management/chapters']],
    '/content-management/page-bank': [['Главная', '/'], ['Управление содержимым', '/content-management/news-bank'], ['Банк страниц', '/content-management/page-bank']],
    '/content-management/verification-centre': [['Главная', '/'], ['Управление содержимым', '/content-management/news-bank'], ['Удостоверяющий центр', '/content-management/verification-centre']],
    '/content-management/event-log': [['Главная', '/'], ['Управление содержимым', '/content-management/news-bank'], ['Журнал событий', '/content-management/event-log']],
    '/content-management/event-log/:id': [['Главная', '/'], ['Управление содержимым', '/content-management/news-bank'], ['Журнал событий', '/content-management/event-log'], { entity: EventEntity, titlePath: 'id', href: '/content-management/event-log/$0' }],

    '/data-export': [['Главная', '/'], ['Экспорт данных', '/data-export']],

    '/control/audit/registered': [['Главная', '/'], ['Контроль', '/control/audit/registered'], ['Аудит', '/control/audit/registered']],
    '/control/audit/course': [['Главная', '/'], ['Контроль', '/control/audit/course'], ['Аудит', '/control/audit/course']],
    '/control/audit/program': [['Главная', '/'], ['Контроль', '/control/audit/program'], ['Аудит', '/control/audit/program']],
    '/control/registered': [['Главная', '/'], ['Контроль', '/control/audit'], ['Зарегистрированные пользователи', '/control/registered']],
    '/control/sessions': [['Главная', '/'], ['Контроль', '/control/audit'], ['Открытые сессии пользователей', '/control/sessions']],
    '/control/user-period': [['Главная', '/'], ['Контроль', '/control/audit'], ['Обучение пользователя за период', '/control/user-period']],
    '/control/user-performance': [['Главная', '/'], ['Контроль', '/control/audit'], ['Успеваемость пользователя', '/control/user-performance']],
    '/control/user-program': [['Главная', '/'], ['Контроль', '/control/audit'], ['Обучение пользователей по программе обучения', '/control/user-program']],
    '/control/group-program': [['Главная', '/'], ['Контроль', '/control/audit'], ['Обучение группы по программе обучения', '/control/group-program']],

    '/roles-and-rights': [['Главная', '/'], ['Роли и права', '/roles-and-rights']],
    '/roles-and-rights/:id/properties': [['Главная', '/'], ['Роли и права', '/roles-and-rights'], { entity: RoleEntity, href: '/roles-and-rights/$0' }, ['Просмотр свойств', '/roles-and-rights/$0/properties']],
    '/roles-and-rights/:id/permissions': [['Главная', '/'], ['Роли и права', '/roles-and-rights'], { entity: RoleEntity, href: '/roles-and-rights/$0' }, ['Редактирование прав', '/roles-and-rights/$0/permissions']],
    '/roles-and-rights/:id': [['Главная', '/'], ['Роли и права', '/roles-and-rights'], { entity: RoleEntity, href: '/roles-and-rights/$0' }],
    '/roles-and-rights/:id/add': [['Главная', '/'], ['Роли и права', '/roles-and-rights'], { entity: RoleEntity, href: '/roles-and-rights/$0' }, ['Добавление пользователей', '/roles-and-rights/$0/add']],
  }
}
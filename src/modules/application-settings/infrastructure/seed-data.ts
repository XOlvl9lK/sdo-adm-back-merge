import {
  PermissionCodeToDescriptionMap,
  PermissionEntity,
  PermissionEnum,
} from '@modules/user/domain/permission.entity';
import { plainToInstance } from 'class-transformer';
import { v4 as uuidv4 } from 'uuid';
import { RoleEntity } from '@modules/user/domain/role.entity';
import { UserEntity } from '@modules/user/domain/user.entity';
import { ChapterEntity } from '@modules/chapter/domain/chapter.entity';
import { ApplicationSettingsEntity } from '@modules/application-settings/domain/application-settings.entity';
import { PageContentEntity, PageEnum } from '@modules/html/domain/page-content.entity';

export const permissions: PermissionEntity[] = Object.entries(PermissionEnum).map(([key, code]) =>
  plainToInstance(PermissionEntity, {
    id: uuidv4(),
    isArchived: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    code,
    description: PermissionCodeToDescriptionMap[code],
  }),
);

export const adminRole: RoleEntity = plainToInstance(RoleEntity, {
  id: uuidv4(),
  isArchived: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  title: 'Администратор',
  description: 'Администратор',
  isRemovable: false,
  totalUsers: 2,
  permissions,
});

export const listenerRole: RoleEntity = plainToInstance(RoleEntity, {
  id: uuidv4(),
  isArchived: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  title: 'Слушатель',
  description: 'Слушатель',
  isRemovable: false,
  totalUsers: 0,
  permissions: permissions.filter(p => {
    switch (p.code) {
      case PermissionEnum.COURSE_SIGN_UP:
        return true;
      case PermissionEnum.EDUCATION_REQUESTS:
        return true;
      case PermissionEnum.FORUM:
        return true;
      case PermissionEnum.FORUM_CREATE_MESSAGE:
        return true;
      case PermissionEnum.FORUM_CREATE_THEME:
        return true;
      case PermissionEnum.FORUM_EDIT_MESSAGE:
        return true;
      case PermissionEnum.FORUM_EDIT_THEME:
        return true;
      case PermissionEnum.FORUM_OPEN_CLOSE:
        return true;
      case PermissionEnum.INSTALLERS:
        return true;
      case PermissionEnum.LIBRARY:
        return true;
      case PermissionEnum.MESSAGE:
        return true;
      case PermissionEnum.MESSAGE_CREATE:
        return true;
      case PermissionEnum.PERFORMANCE:
        return true;
      case PermissionEnum.PROFILE:
        return true;
      case PermissionEnum.PROFILE_EDIT:
        return true;
      case PermissionEnum.PROGRAM_SETTINGS:
        return true;
      case PermissionEnum.PROGRAM_SIGN_UP:
        return true;
      case PermissionEnum.TEST_SIGN_UP:
        return true;
      case PermissionEnum.TIMETABLE:
        return true;
    }
  }),
});

export const admin: UserEntity = plainToInstance(UserEntity, {
  id: uuidv4(),
  isArchived: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  login: 'admin',
  password: '$2b$05$9vis1qOgjFM5u6t/BWrUb.gBbIyqDt5jrESfQ9M7DAfXLBogplKF2',
  role: adminRole,
});

export const sdo: UserEntity = plainToInstance(UserEntity, {
  id: '71f9c8c2-378f-4860-ab40-78dfdc2024ff',
  isArchived: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  login: 'sdo',
  password: '$2b$05$9CJbo17OsI2otDzza.Xtp.1UZUrsyhpSknagj.jLfa7rJW7H/TP72',
  firstName: 'и технической поддержки',
  lastName: 'Портал дистанционного обучения',
  fullName: 'Портал дистанционного обучения и технической поддержки',
  role: adminRole,
});

export const basicChapter: ChapterEntity = plainToInstance(ChapterEntity, {
  id: uuidv4(),
  isArchived: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  title: 'Основной раздел',
  description: 'Основной раздел',
});

export const certificateIssuance: ApplicationSettingsEntity = plainToInstance(ApplicationSettingsEntity, {
  id: uuidv4(),
  title: 'Issuance of certificates',
  isActive: true,
});

export const basicChapterId: ApplicationSettingsEntity = plainToInstance(ApplicationSettingsEntity, {
  id: uuidv4(),
  title: 'Basic chapter id',
  isActive: true,
  value: basicChapter.id
})

export const maxExportWorkers: ApplicationSettingsEntity = plainToInstance(ApplicationSettingsEntity, {
  id: 'ebed1f64-2c53-4280-95ce-2620a60267d6',
  title: 'Maximum of export workers',
  isActive: true,
  value: '1'
})

export const isApplicationSeeded: ApplicationSettingsEntity = plainToInstance(ApplicationSettingsEntity, {
  id: uuidv4(),
  title: 'Is data seeded',
  isActive: true,
})

export const mainPage: PageContentEntity = plainToInstance(PageContentEntity, {
  id: uuidv4(),
  page: PageEnum.MAIN,
  content: '',
  description: 'Главная'
})

export const contactsPage: PageContentEntity = plainToInstance(PageContentEntity, {
  id: uuidv4(),
  page: PageEnum.CONTACTS,
  content: '',
  description: 'Контакты'
})